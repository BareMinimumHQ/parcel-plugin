# Agents

When changing anything in this repository, review both sides of the Parcel MCP contract: this plugin's skills and instructions, and the corresponding server tools and behavior in the Parcel application repository.

Treat the agent interface as an evolving public contract. New capabilities and compatible additions are welcome; preserve existing calls and their meaning where possible. When changing either repository, assess the effect on the other and update both when required. For incompatible changes, identify the affected workflows and coordinate delivery so supported packages remain usable; do not assume tool discovery immediately refreshes every installed package or provider-held definition. Keep the relevant contract and alignment checks current, and review compatibility before accepting changes to their expectations.

- Use the current public operation definitions, server behavior, and relevant tests to confirm that each workflow remains achievable. Check authorization, preservation, conflict handling, and result meaning; a valid payload alone does not prove the workflow is correct.
- Keep skills focused on outcomes, product rules, evidence standards, and user intent. Exact operation names, argument fields, payload modes, response paths, and storage bookkeeping belong outside bundled workflow guidance. Use discovered operation requirements for current mechanics.
- Check the shared skill and all affected workflow references for conflicting or outdated guidance. Update both repositories when a change requires it.
- If the Parcel repository is unavailable, state that the server-side review could not be completed. Do not claim that both sides agree.
- Run the relevant checks in each changed repository. Plugin guidance changes need a plugin release to reach provider-distributed packages; merging main alone does not update installed plugins.

## Git

- Use conventional commits.
- Keep commit message extremely short and high level. No expanded explanations.
