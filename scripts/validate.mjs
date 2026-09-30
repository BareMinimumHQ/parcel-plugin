import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const codexCatalog = read(".agents/plugins/marketplace.json");
const claudeCatalog = read(".claude-plugin/marketplace.json");
const codex = read("plugins/parcel/.codex-plugin/plugin.json");
const claude = read("plugins/parcel/.claude-plugin/plugin.json");
const mcp = read("plugins/parcel/.mcp.json");

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
// Check the actual packaged icon, so a missing or unsuitable asset fails CI.
for (const field of ["logo", "composerIcon"]) {
  assert.equal(codex.interface[field], "./assets/logo.png");
}
const logo = readFileSync("plugins/parcel/assets/logo.png");
assert.deepEqual(logo.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
assert.equal(logo.toString("ascii", 12, 16), "IHDR");
assert.equal(logo.readUInt32BE(16), 512);
assert.equal(logo.readUInt32BE(20), 512);
assert.ok(logo.length <= 5 * 1024 * 1024, "Logo must be at most 5 MiB");
assert.ok(existsSync("plugins/parcel/assets/parcel-mark.svg"));
assert.equal(codex.interface.defaultPrompt.length, 3);
for (const prompt of codex.interface.defaultPrompt) {
  assert.ok(prompt.trim().length > 0, "Starter prompts must not be empty");
}
assert.equal(mcp.mcpServers.parcel.type, "http");
assert.equal(mcp.mcpServers.parcel.url, "https://workinparcel.com/mcp");
assert.equal(Object.keys(mcp.mcpServers).length, 1);
assert.ok(existsSync("plugins/parcel/skills/organize-job-search/SKILL.md"));
for (const name of readdirSync("plugins/parcel/skills")) {
  const skill = readFileSync(`plugins/parcel/skills/${name}/SKILL.md`, "utf8");
  const dependency = readFileSync(
    `plugins/parcel/skills/${name}/agents/openai.yaml`,
    "utf8",
  );
  assert.match(skill, new RegExp(`^---\\nname: ${name}\\n`));
  assert.match(dependency, /value: ['"]parcel['"]/);
  assert.match(dependency, /url: ['"]https:\/\/workinparcel\.com\/mcp['"]/);
}
console.log("Parcel plugin package checks passed");
