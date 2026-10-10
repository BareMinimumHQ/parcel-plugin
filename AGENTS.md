# Agents

When changing anything in this repository, review both sides of the Parcel MCP contract: this plugin's skills and instructions, and the corresponding server tools and behavior in the Parcel application repository.

- Use the current server code, public tool definitions, and relevant tests to confirm tool names, inputs, outputs, revisions, replacement behavior, and authorization requirements. Do not assume that a valid payload proves the workflow instructions are correct.
- Check the shared skill and all affected workflow references for conflicting or outdated guidance. Update both repositories when a change requires it.
- If the Parcel repository is unavailable, state that the server-side review could not be completed. Do not claim that both sides agree.
- Run the relevant checks in each changed repository. Plugin guidance changes need a plugin release to reach provider-distributed packages; merging main alone does not update installed plugins.

## Git

- Use conventional commits.
- Keep commit message extremely short and high level. No expanded explanations.
