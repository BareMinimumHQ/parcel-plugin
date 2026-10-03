# Company research for an Interview

Use the `parcel` MCP tools to identify the Job and read its current Posting, Company research, relevant links, collection revision, and limits. Gather only sources you can access. Separate confirmed facts, inferences, and open questions, with labeled HTTP(S) links. Do not claim Parcel verified the sources.

Read the role before researching the company so the work has a clear focus. Prefer the company site, product and engineering blogs, investor or earnings materials when relevant, press releases, and recent public leadership statements. Use independent reporting to add material context or corroborate important claims. Identify what the company offers, whom it serves, its business model or stage when relevant, and the product or technical themes the role may touch.

Focus on relevant developments from roughly the last twelve months: launches, strategy changes, customer or platform moves, leadership changes, and technical direction. Check event dates rather than assume a newly published article describes a new event. Link every material current-company claim to a descriptive source. Label inferences about why the role matters, and state thin or conflicting evidence plainly. Keep research objective and concise; omit generic boilerplate. Do this work when requested rather than automatically for every discovered Job.

Propose ordered sections and concise items with Low, Medium, or High Priority. Reconcile useful existing items, update superseded information, and avoid duplicates. Show the proposed replacement or focused edit for review. When the person authorizes saving, call `update_company_research` with the expected collection revision and a fresh UUID `operationId`. Reuse that key only when retrying the exact same uncertain write.

If the revision is stale, read again and reconcile. If a source is unavailable, report the gap; do not replace useful content merely because a lookup failed. Never invent a successful save.
