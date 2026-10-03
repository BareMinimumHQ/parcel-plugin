import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

export function generatedManifests(plugin, mcp) {
  const shared = Object.fromEntries(
    [
      "name",
      "version",
      "description",
      "author",
      "homepage",
      "repository",
      "license",
      "keywords",
    ].map((key) => [key, plugin[key]]),
  );
  const openai = plugin.extensions["com.openai"];
  const servers = Object.fromEntries(
    Object.entries(mcp.mcpServers).map(([name, server]) => {
      assert.equal(
        server.type,
        "streamable-http",
        "Parcel uses remote Streamable HTTP",
      );
      return [name, { ...server, type: "http" }];
    }),
  );
  return {
    "plugins/parcel/.codex-plugin/plugin.json": {
      ...shared,
      skills: "./skills/",
      mcpServers: "./.mcp.json",
      interface: openai.interface,
      extensions: plugin.extensions,
    },
    "plugins/parcel/.claude-plugin/plugin.json": {
      name: plugin.name,
      displayName: openai.interface.displayName,
      ...shared,
      icon: openai.interface.logo,
      documentationUrl: `${plugin.repository}/tree/main/plugins/parcel`,
      supportUrl: openai.interface.supportURL,
      privacyPolicyUrl: openai.interface.privacyPolicyURL,
      termsOfServiceUrl: openai.interface.termsOfServiceURL,
    },
    "plugins/parcel/.mcp.json": { mcpServers: servers },
    ".agents/plugins/marketplace.json": {
      name: plugin.name,
      interface: { displayName: openai.interface.displayName },
      plugins: [
        {
          name: plugin.name,
          source: { source: "local", path: "./plugins/parcel" },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: openai.interface.category,
        },
      ],
    },
    ".claude-plugin/marketplace.json": {
      name: plugin.name,
      description: plugin.description,
      owner: { name: plugin.author.name, email: plugin.author.email },
      plugins: [
        {
          name: plugin.name,
          source: "./plugins/parcel",
          description: plugin.description,
        },
      ],
    },
  };
}

export function syncManifests(root, write = false) {
  const read = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
  const generated = generatedManifests(
    read("plugins/parcel/plugin.json"),
    read("plugins/parcel/mcp.json"),
  );
  for (const [path, expected] of Object.entries(generated)) {
    if (write) {
      if (existsSync(resolve(root, path))) {
        let unchanged = false;
        try {
          assert.deepEqual(read(path), expected);
          unchanged = true;
        } catch (error) {
          if (!(error instanceof assert.AssertionError)) throw error;
        }
        if (unchanged) continue;
      }
      mkdirSync(dirname(resolve(root, path)), { recursive: true });
      writeFileSync(
        resolve(root, path),
        JSON.stringify(expected, null, 2) + "\n",
      );
    } else {
      assert.deepEqual(
        read(path),
        expected,
        `${path} is stale; run node scripts/sync-manifests.mjs --write`,
      );
    }
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  assert.ok(
    process.argv.slice(2).every((arg) => ["--write", "--check"].includes(arg)),
  );
  syncManifests(process.cwd(), process.argv.includes("--write"));
  console.log(
    process.argv.includes("--write")
      ? "Generated host manifests and catalogs"
      : "Generated metadata is consistent",
  );
}
