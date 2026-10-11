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
import { syncManifests } from "./sync-manifests.mjs";

test("source changes fail checking until regenerated; manual catalog edits also fail", () => {
  const root = mkdtempSync(resolve(tmpdir(), "parcel-metadata-"));
  try {
    mkdirSync(resolve(root, "plugins/parcel"), { recursive: true });
    for (const name of ["plugin.json", "mcp.json"]) {
      writeFileSync(
        resolve(root, "plugins/parcel", name),
        readFileSync(resolve("plugins/parcel", name)),
      );
    }
    syncManifests(root, true);
    syncManifests(root);
    const source = resolve(root, "plugins/parcel/plugin.json");
    const plugin = JSON.parse(readFileSync(source, "utf8"));
    plugin.version = "9.8.7";
    plugin.description = "Changed source description";
    plugin.author.name = "Changed source author";
    plugin.extensions["com.openai"].interface.displayName = "Changed display";
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
