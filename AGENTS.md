# Agents

When changing anything in this repository, review both sides of the Parcel MCP contract: this plugin's skills and instructions, and the corresponding server tools and behavior in the Parcel application repository.

Treat the agent interface as an evolving public contract. New capabilities and compatible additions are welcome; preserve existing calls and their meaning where possible.

When changing either repository, assess the effect on the other and update both when required.

For incompatible changes, identify the affected workflows and coordinate delivery so supported packages remain usable; do not assume tool discovery immediately refreshes every installed package or provider-held definition.

Follow the application's permanent [release compatibility policy](https://github.com/thesimonho/parcel/blob/main/docs/plugin-distribution/workflow-contracts.md#release-compatibility). Keep supported packages usable during provider review and user rollout. Label dependent changes `coordinated-release` and ship compatible server support before distributing new guidance; retiring old behavior requires a separate support decision. The submitted OpenAI v1.1.1 package remains the current floor. Automated checks protect explicit contracts, not natural-language workflow meaning: paired review must assess both supported and candidate guidance against real server behavior and record dependencies and limitations. This contributor policy is excluded from the installed package.

Keep the relevant contract and alignment checks current, and review compatibility before accepting changes to their expectations.

- Use the current public operation definitions, server behavior, and relevant tests to confirm that each workflow remains achievable. Check authorization, preservation, conflict handling, and result meaning; a valid payload alone does not prove the workflow is correct.
- Keep skills focused on outcomes, product rules, evidence standards, and user intent. Exact operation names, argument fields, payload modes, response paths, and storage bookkeeping belong outside bundled workflow guidance. Use discovered operation requirements for current mechanics.
- Check the shared skill and all affected workflow references for conflicting or outdated guidance. Update both repositories when a change requires it.
- If the Parcel repository is unavailable, state that the server-side review could not be completed. Do not claim that both sides agree.
- Run the relevant checks in each changed repository. Plugin guidance changes need a plugin release to reach provider-distributed packages; merging main alone does not update installed plugins.

## Development and releases

Edit the repository-root README.md for user documentation; plugins/parcel/README.md is its generated copy. Keep links valid in both locations and omit decorative bundled image references from the shared README to avoid directory policy holds.

Edit shared metadata in the repository-root `plugin.json`. Packaged manifests and marketplace catalogs are generated; do not edit them directly. Run `node scripts/sync-manifests.mjs --write` after metadata changes, then `node scripts/validate.mjs` for package checks. See `scripts/README.md` for the provider mappings and submission checks.

Merging a plugin fix or documentation change into main lets Release Please prepare a release PR. Merging that release PR cuts the version and attaches inspected packages.

Guidance changes need a plugin release to reach provider-distributed packages; website-only changes do not require a plugin release. Provider publication and user updates follow each provider's distribution process.

## Git

- Use conventional commits.
- Keep commit message extremely short and high level. No expanded explanations.
