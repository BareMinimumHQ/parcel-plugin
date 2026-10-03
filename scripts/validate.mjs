import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";

import { generatedManifests } from "./sync-manifests.mjs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const packageRoot = resolve(process.argv[2] ?? "plugins/parcel");
const packaged = (path) => resolve(packageRoot, path);
const codexCatalog = read(".agents/plugins/marketplace.json");
const claudeCatalog = read(".claude-plugin/marketplace.json");
const codex = read(packaged(".codex-plugin/plugin.json"));
const claude = read(packaged(".claude-plugin/plugin.json"));
const mcp = read(packaged(".mcp.json"));

assert.equal(codexCatalog.name, "parcel");
assert.equal(claudeCatalog.name, "parcel");
assert.equal(codexCatalog.plugins.length, 1);
assert.equal(claudeCatalog.plugins.length, 1);
assert.equal(codexCatalog.plugins[0].source.path, "./plugins/parcel");
assert.equal(claudeCatalog.plugins[0].source, "./plugins/parcel");
assert.equal(claudeCatalog.plugins[0].name, "parcel");
assert.equal(codexCatalog.plugins[0].policy.authentication, "ON_INSTALL");
assert.equal(codex.name, "parcel");
assert.equal(claude.name, "parcel");
assert.equal(codex.version, claude.version);
assert.equal(codex.license, "GPL-3.0-only");
assert.equal(claude.license, codex.license);
for (const [field, maximum] of Object.entries({
  displayName: 30,
  shortDescription: 30,
  longDescription: 4000,
  developerName: 80,
})) {
  const value = codex.interface[field];
  assert.equal(typeof value, "string", `${field} must be text`);
  assert.ok(
    value.trim().length > 0 && value.length <= maximum,
    `${field} must be 1-${maximum} characters`,
  );
}
for (const field of [
  "websiteURL",
  "privacyPolicyURL",
  "termsOfServiceURL",
  "supportURL",
]) {
  assert.equal(new URL(codex.interface[field]).protocol, "https:");
}
assert.equal(
  new Set(
    codex.interface.defaultPrompt.map((text) => text.trim().toLowerCase()),
  ).size,
  codex.interface.defaultPrompt.length,
);

function checkPackagedLinks(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Symlink forbidden: ${path}`);
    if (entry.isDirectory()) checkPackagedLinks(path);
    else if (entry.name.endsWith(".md")) {
      for (const match of readFileSync(path, "utf8").matchAll(
        /!?\[[^\]]*\]\(([^\s)]+)(?:\s+[^)]*)?\)/g,
      )) {
        const target = match[1];
        if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#"))
          continue;
        const resolved = resolve(dirname(path), target.split("#")[0]);
        assert.ok(
          !relative(packageRoot, resolved).startsWith(".."),
          `${path}: link leaves the installed package: ${target}`,
        );
        assert.ok(
          existsSync(resolved),
          `${path}: missing packaged link: ${target}`,
        );
      }
    }
  }
}
checkPackagedLinks(packageRoot);
for (const [fields, theme, color] of [
  [["logo", "composerIcon"], "light", "#10567d"],
  [["logoDark", "composerIconDark"], "dark", "#c4e1f2"],
]) {
  for (const field of fields)
    assert.equal(codex.interface[field], `./assets/logo-${theme}.svg`);
  const svg = readFileSync(packaged(`assets/logo-${theme}.svg`), "utf8");
  assert.match(svg, /<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(svg, /viewBox="-9 -19\.75 120 120"/);
  assert.ok(svg.includes(`color="${color}"`));
  assert.ok(
    !svg.includes("<style") &&
      !svg.includes("<script") &&
      !svg.includes("href="),
  );
}
const logo = readFileSync(packaged("assets/logo.png"));
assert.deepEqual(
  logo.subarray(0, 8),
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
);
assert.equal(logo.toString("ascii", 12, 16), "IHDR");
assert.equal(logo.readUInt32BE(16), 512);
assert.equal(logo.readUInt32BE(20), 512);
assert.ok(logo.length <= 5 * 1024 * 1024, "Logo must be at most 5 MiB");
assert.ok(existsSync(packaged("assets/parcel-mark.svg")));
assert.equal(codex.interface.defaultPrompt.length, 3);
for (const prompt of codex.interface.defaultPrompt) {
  assert.ok(prompt.trim().length > 0, "Starter prompts must not be empty");
}
assert.equal(mcp.mcpServers.parcel.type, "http");
assert.equal(mcp.mcpServers.parcel.url, "https://workinparcel.com/mcp");
assert.equal(Object.keys(mcp.mcpServers).length, 1);
assert.ok(existsSync(packaged("skills/parcel/SKILL.md")));
for (const name of readdirSync(packaged("skills"))) {
  const skill = readFileSync(packaged(`skills/${name}/SKILL.md`), "utf8");
  const dependency = readFileSync(
    packaged(`skills/${name}/agents/openai.yaml`),
    "utf8",
  );
  assert.match(skill, new RegExp(`^---\\nname: ${name}\\n`));
  assert.match(dependency, /value: ['"]parcel['"]/);
  assert.match(dependency, /url: ['"]https:\/\/workinparcel\.com\/mcp['"]/);
}
console.log("Parcel plugin package checks passed");

const portable = read(packaged("plugin.json"));
const portableMcp = read(packaged("mcp.json"));
assert.match(portable.version, /^\d+\.\d+\.\d+$/);
assert.equal(portable.version, read(".release-please-manifest.json")["."]);
for (const manifest of [codex, claude]) {
  for (const field of [
    "name",
    "version",
    "description",
    "author",
    "homepage",
    "repository",
    "license",
    "keywords",
  ]) {
    assert.deepEqual(
      manifest[field],
      portable[field],
      `Manifest drift: ${field}`,
    );
  }
}
assert.deepEqual(portable.extensions["com.openai"].interface, codex.interface);
assert.deepEqual(
  portable.extensions["com.openai"].review,
  codex.extensions["com.openai"].review,
);
assert.deepEqual(
  portable.extensions["com.openai"].publication,
  codex.extensions["com.openai"].publication,
);
for (const manifest of [portable, codex, claude]) {
  assert.ok(
    manifest.apps == null,
    "Registered app bindings cannot be submitted",
  );
  assert.ok(manifest.hooks == null, "Public package must not contain hooks");
}
assert.ok(!existsSync(packaged(".app.json")));
assert.equal(portableMcp.mcpServers.parcel.type, "streamable-http");
assert.equal(portableMcp.mcpServers.parcel.url, mcp.mcpServers.parcel.url);
assert.equal(Object.keys(portableMcp.mcpServers).length, 1);
assert.equal(readdirSync(packaged("skills")).length, 1);
assert.equal(readdirSync(packaged("skills/parcel/references")).length, 8);
for (const prompt of codex.interface.defaultPrompt)
  assert.ok(prompt.length <= 128 && !prompt.includes("\n"));
const { review, publication } = portable.extensions["com.openai"];
assert.equal(review.commerce, false);
assert.deepEqual(publication.countries, []);
assert.ok(publication.release_notes.trim());
for (const [kind, count, fields] of [
  [
    "positive",
    5,
    ["description", "prompt", "tools_triggered", "expected_behavior"],
  ],
  ["negative", 3, ["description", "prompt"]],
]) {
  assert.equal(review.test_cases[kind].length, count);
  for (const test of review.test_cases[kind]) {
    assert.deepEqual(Object.keys(test).sort(), fields.slice().sort());
    for (const field of fields)
      assert.ok(typeof test[field] === "string" && test[field].trim());
  }
}
assert.ok(existsSync(packaged("LICENSE")));
const prose = readFileSync(packaged("README.md"), "utf8").replace(
  /```[\s\S]*?```/g,
  "",
);
assert.ok(prose.split(/\s+/).length >= 40);
console.log("Portable manifests and directory metadata checks passed");

for (const [path, expected] of Object.entries(
  generatedManifests(portable, portableMcp),
)) {
  const actualPath = path.startsWith("plugins/parcel/")
    ? packaged(path.slice("plugins/parcel/".length))
    : path;
  assert.deepEqual(
    read(actualPath),
    expected,
    `${path}: regenerate with node scripts/sync-manifests.mjs --write`,
  );
}
