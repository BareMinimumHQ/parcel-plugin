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
  assert.ok(
    !plugin.extensions?.["com.openai"]?.interface,
    "Shared presentation belongs in the root metadata fields",
  );
  const presentation = {
    displayName: plugin.displayName,
    shortDescription: plugin.shortDescription,
    longDescription: plugin.description,
    developerName: plugin.author.name,
    category: plugin.category,
    capabilities: plugin.capabilities,
    defaultPrompt: plugin.defaultPrompt,
    websiteURL: plugin.homepage,
    supportURL: plugin.supportUrl,
    privacyPolicyURL: plugin.privacyPolicyUrl,
    termsOfServiceURL: plugin.termsOfServiceUrl,
    logo: plugin.logo,
    composerIcon: plugin.logo,
    logoDark: plugin.logoDark,
    composerIconDark: plugin.logoDark,
  };
  const extensions = {
    ...plugin.extensions,
    "com.openai": {
      ...plugin.extensions?.["com.openai"],
      interface: presentation,
    },
  };
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
    "plugins/parcel/plugin.json": {
      $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
      ...shared,
      extensions,
    },
    "plugins/parcel/.codex-plugin/plugin.json": {
      ...shared,
      skills: "./skills/",
      mcpServers: "./.mcp.json",
      interface: presentation,
      extensions,
    },
    "plugins/parcel/.claude-plugin/plugin.json": {
      ...shared,
      displayName: plugin.displayName,
      icon: plugin.icon,
      documentationUrl: plugin.documentationUrl,
      supportUrl: plugin.supportUrl,
      privacyPolicyUrl: plugin.privacyPolicyUrl,
      termsOfServiceUrl: plugin.termsOfServiceUrl,
    },
    "plugins/parcel/.mcp.json": { mcpServers: servers },
    ".agents/plugins/marketplace.json": {
      name: plugin.name,
      interface: { displayName: plugin.displayName },
      plugins: [
        {
          name: plugin.name,
          source: { source: "local", path: "./plugins/parcel" },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: plugin.category,
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
          displayName: plugin.displayName,
          description: plugin.description,
        },
      ],
    },
  };
}

export function syncReadme(
  root,
  write = false,
  packageRoot = resolve(root, "plugins/parcel"),
) {
  const expected = readFileSync(resolve(root, "README.md"), "utf8");
  const destination = resolve(packageRoot, "README.md");
  if (write) {
    mkdirSync(dirname(destination), { recursive: true });
    if (
      !existsSync(destination) ||
      readFileSync(destination, "utf8") !== expected
    ) {
      writeFileSync(destination, expected);
    }
  } else {
    assert.equal(
      readFileSync(destination, "utf8"),
      expected,
      "Packaged README is stale; run node scripts/sync-manifests.mjs --write",
    );
  }
}

export function syncManifests(root, write = false) {
  syncReadme(root, write);
  const read = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
  const generated = generatedManifests(
    read("plugin.json"),
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
      ? "Generated README, host manifests and catalogs"
      : "Generated metadata is consistent",
  );
}
