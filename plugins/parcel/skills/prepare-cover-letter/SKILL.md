---
name: prepare-cover-letter
description: Use when a person asks to draft, prepare, create, or revise a Cover Letter for a Job in Parcel.
---

# Prepare a Cover Letter

Use the `parcel` MCP tools to read the Job, Saved Job Posting, current Cover Letter, relevant Career Profile and Job Resume. Use Company research when useful and distinguish sourced facts from inference. Ask for missing material that prevents a credible letter. Do not invent personal experience, achievements, company facts, contact names, addresses, or reasons for interest.

Read the role before choosing company context. Prefer a few specific links between the role's needs and truthful experience, outcomes and motivation. Use current sourced company information only when it helps explain that connection; do not pad the letter with company boilerplate or praise. Write the letter in the person's first-person voice and keep wording natural. Ask for genuine motivation when it is missing, rather than inventing it.

Draft a concise letter with specific, supported connections between the person's experience and the role. Preserve useful existing wording when revising; avoid generic praise and unsupported claims. If `get_cover_letter` returns no saved letter, fill its exact nonpersistent `creationDocument` using its Parcel-assigned section/item IDs. Do not invent a new document structure or IDs. Viewing this creation template does not save it.

Show the proposed content for review. Only after approval, use focused `edit_cover_letter` operations or `save_cover_letter` with the current revision (0 for first save) and complete retained document. Full saves remove omitted content, so preserve IDs and unrelated fields from the current read. Follow discovered tool schemas and limits. Read back the saved letter and use `show_document` with `kind: cover-letter` when the person wants to see its actual saved PDF. An unsaved draft will not appear in that PDF.

Use a fresh UUID `operationId` for each logical write. Retry uncertain writes only with their exact original key and arguments. Read and reconcile stale revisions instead of overwriting concurrent work. Do not submit externally, publish documents, change Job status, or claim that saving sent an application.
