import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { syncManifests, generatedManifests } from "./sync-manifests.mjs";

test("source changes fail checking until regenerated; manual catalog edits also fail", () => {
  const root = mkdtempSync(resolve(tmpdir(), "parcel-metadata-"));
  try {
    mkdirSync(resolve(root, "plugins/parcel"), { recursive: true });
    writeFileSync(resolve(root, "plugin.json"), readFileSync("plugin.json"));
    for (const name of ["mcp.json"]) {
      writeFileSync(
        resolve(root, "plugins/parcel", name),
        readFileSync(resolve("plugins/parcel", name)),
      );
    }
    syncManifests(root, true);
    syncManifests(root);
    const source = resolve(root, "plugin.json");
    const plugin = JSON.parse(readFileSync(source, "utf8"));
    plugin.version = "9.8.7";
    plugin.description = "Changed source description";
    plugin.author.name = "Changed source author";
    plugin.displayName = "Changed display";
    writeFileSync(source, JSON.stringify(plugin));
    assert.throws(() => syncManifests(root), /is stale/);
    syncManifests(root, true);
    syncManifests(root);
    const catalog = resolve(root, ".claude-plugin/marketplace.json");
    const edited = JSON.parse(readFileSync(catalog, "utf8"));
    edited.owner.name = "Manual drift";
    writeFileSync(catalog, JSON.stringify(edited));
    assert.throws(() => syncManifests(root), /is stale/);
    syncManifests(root, true);
    syncManifests(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("shared presentation reaches both hosts without OpenAI metadata", () => {
  const plugin = JSON.parse(readFileSync("plugin.json", "utf8"));
  const mcp = JSON.parse(readFileSync("plugins/parcel/mcp.json", "utf8"));
  plugin.displayName = "Shared name";
  plugin.supportUrl = "https://example.com/support";
  plugin.documentationUrl = "https://example.com/docs";
  plugin.description = "Shared description";
  const withProvider = generatedManifests(plugin, mcp);
  delete plugin.extensions;
  const withoutProvider = generatedManifests(plugin, mcp);
  const claude = withoutProvider["plugins/parcel/.claude-plugin/plugin.json"];
  const portable = withoutProvider["plugins/parcel/plugin.json"];
  const codex = withoutProvider["plugins/parcel/.codex-plugin/plugin.json"];
  assert.deepEqual(
    claude,
    withProvider["plugins/parcel/.claude-plugin/plugin.json"],
  );
  assert.equal(claude.displayName, "Shared name");
  assert.equal(claude.supportUrl, "https://example.com/support");
  assert.equal(claude.documentationUrl, "https://example.com/docs");
  assert.equal(claude.description, codex.interface.longDescription);
  assert.equal(portable.description, codex.interface.longDescription);
  assert.equal(codex.interface.displayName, claude.displayName);
  assert.equal(codex.interface.supportURL, claude.supportUrl);
  assert.ok(
    !("displayName" in portable),
    "Portable manifest uses its provider extension",
  );
  plugin.extensions = {
    "com.openai": { interface: { displayName: "Conflicting name" } },
  };
  assert.throws(() => generatedManifests(plugin, mcp), /Shared presentation/);
});
