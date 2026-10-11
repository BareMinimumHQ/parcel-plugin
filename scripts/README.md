---
agent:
  instruction: Keep metadata generation, release ownership, and submission checks current when these scripts change.
  on-change:
    - scripts/**
    - plugin.json
    - release-please-config.json
    - .github/workflows/release.yml
---

# Plugin tooling

The repository-root `plugin.json` is the authoring source. Its root fields hold shared identity, presentation, URLs, prompts, and assets. `extensions.com.openai` holds only OpenAI-specific review and publication information. The source is not an installable manifest and is not included in the upload archive.

`sync-manifests.mjs` adapts those fields into the portable `plugins/parcel/plugin.json`, the Codex and Claude manifests, and both marketplace catalogs. The portable format requires OpenAI presentation under `extensions.com.openai.interface`; this is generated, not a second place to maintain values. Claude generation does not read OpenAI-specific metadata. A source `com.openai.interface` is rejected to prevent duplicate ownership.

| Source                                                                                      | Generated destination                                                   |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `keywords` | Shared manifest metadata                                                |
| `displayName`                                                                               | OpenAI interface and marketplace; Claude manifest and marketplace entry |
| `description`, `shortDescription`, `author.name`                                            | OpenAI long description, subtitle, and developer name                   |
| `homepage`, `supportUrl`, `privacyPolicyUrl`, `termsOfServiceUrl`                           | OpenAI listing URLs; corresponding Claude listing URLs                  |
| `documentationUrl`, `icon`                                                                  | Claude documentation link and listing image                             |
| `logo`, `logoDark`                                                                          | OpenAI logo and composer icon for each theme                            |
| `category`, `capabilities`, `defaultPrompt`                                                 | OpenAI presentation; category also goes to the Codex marketplace        |
| `extensions.com.openai.review`, `extensions.com.openai.publication`                         | OpenAI submission metadata only                                         |

`plugins/parcel/mcp.json` owns the portable server endpoint and transport. Generation maps Streamable HTTP to the host spelling `http` in `.mcp.json`. The skill dependency must name the same server and endpoint; validation checks it.

The repository-root README.md is the user-documentation source. The same generation command copies it verbatim into plugins/parcel/README.md. Validation checks exact equality, including extracted release archives. Use absolute links that work in both locations; the shared README omits decorative bundled images to avoid Claude policy holds. CI checks synchronization, and the release workflow regenerates and commits the copy with its manifests.

## Checks and releases

Run from the repository root:

```sh
node scripts/sync-manifests.mjs --write
node scripts/validate.mjs
node --test scripts/sync-manifests.test.mjs
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/package.py
npm exec --yes --package=@anthropic-ai/claude-code@2.1.282 -- claude plugin validate .
npm exec --yes --package=@anthropic-ai/claude-code@2.1.282 -- claude plugin validate ./plugins/parcel
```

Validation checks generated metadata against the source, including archives after extraction. Packaging rejects escaping paths, symlinks, LFS pointers, case collisions, oversized files, and private app bindings. It creates a deterministic ZIP, checksum, and inventory outside the installed plugin. Check mode does not rewrite files.

Release Please owns versions and tags. It updates the repository-root source; the release workflow regenerates and commits all packaged manifests on the release PR. The tagged release must already contain those generated files. Do not bump a generated version or create a tag manually.

## Claude submission

Submit the bundle with repository `BareMinimumHQ/parcel-plugin` and plugin path `plugins/parcel`. Submit the hosted server separately as an MCP connector at `https://workinparcel.com/mcp`, from the same Claude organization. A remote MCP reference in the bundle does not register a connector. Use the exact same URL in both submissions so the listings can be paired without duplicate tools.

The plugin runs no local server or installer and uses no hooks or credential headers. It connects to Parcel through OAuth, reads the authorized workspace, saves requested changes, and can fetch saved document PDFs. Its README describes these actions. Reviewer credentials belong only in the secure portal fields, never source files or archives.

Re-validate in the portal after pushing fixes: its report applies to one commit. Local validation checks syntax and schema; the portal also checks directory requirements, registration, name availability, and security policy. Verify the populated reviewer account, tool behavior, demo access, and consent attestations through the provider before submission. Do not infer approval or connector registration from local success.

References: [plugin checklist](https://claude.com/docs/plugins/pre-submission-checklist), [connector checklist](https://claude.com/docs/connectors/building/review-criteria), [manifest reference](https://code.claude.com/docs/en/plugins/manifest-reference), and [plugin and connector submissions](https://claude.com/docs/directory/publish#submit-your-plugin-and-your-mcp-server-as-a-connector).
