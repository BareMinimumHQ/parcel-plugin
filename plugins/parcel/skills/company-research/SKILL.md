---
name: company-research
description: Use when a person asks to research a company, team, product, or customer for a specific Job in Parcel.
---

# Company research for an Interview

Use the `parcel` MCP tools to identify the Job and read its current Posting, Company research, relevant links, collection revision, and limits. Gather only sources you can access. Separate confirmed facts, inferences, and open questions, with labeled HTTP(S) links. Do not claim Parcel verified the sources.

Propose ordered sections and concise items with Low, Medium, or High Priority. Reconcile useful existing items, update superseded information, and avoid duplicates. Show the proposed replacement or focused edit for review. When the person authorizes saving, call `save_company_research` with the expected collection revision and a fresh UUID `operationId`. Reuse that key only when retrying the exact same uncertain write.

If the revision is stale, read again and reconcile. If a source is unavailable, report the gap; do not replace useful content merely because a lookup failed. Never invent a successful save.
