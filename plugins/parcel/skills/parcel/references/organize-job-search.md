# Organize a job search in Parcel

Use the `parcel` MCP tools for current account information. Use an applicable current read or confirmed save result, its server-assigned identifiers, and its revision guards. Fetch missing or outdated context and reconcile stale revisions; summarize the confirmed saved result. If authorization has expired, ask the person to reconnect Parcel; do not infer private data from the skill or claim an unsaved change succeeded.

The person chooses which jobs to pursue. Parcel holds the workspace; it does not submit applications. Keep prepared text, saved documents, and external actions distinct. Ask before replacing existing content when the intended change is unclear. Do not treat a Job marked Applied as proof of an external submission.

For a new Job, use the bounded Job creation tool and its confirmed saved result; read more workspace context only when needed. For an existing Job, first find it by the person's description, then use the matching read or update tool for the requested stage. For documents, distinguish an editable Resume or Cover Letter from a generated PDF or uploaded artifact. For interviews and notes, use the current Job workspace rather than making a separate timeline.

Never invent tool names, IDs, revisions, or success states. If the available Parcel tools do not cover a requested action, explain the missing action and offer a website handoff.

## Save an attached PDF

When the person asks to save an attached PDF in their reusable library, use `import_resume_pdf` if discovered and the host supplies a supported file reference. It saves the original PDF as an Account Resume; it does not extract editable content. For replacement, read the current Account Resume and use its ID and revision. Keep the operationId, PDF bytes and action unchanged on retries; a refreshed temporary download URL is allowed. For a chat attachment, supply file, operationId and action to the save tool directly; do not prepare a local upload. Only when the assistant has local PDF bytes without a host file reference, use `prepare_local_account_resume_pdf_upload`, PUT the bytes to its returned URL, and call `import_resume_pdf` with only uploadId. Preparation does not save a Resume. If neither transfer path is available, offer the website upload. Do not save or replace an Account Resume merely because the person attached a source for another task, and do not add approval steps to an explicit save request.

## Focused document changes

Use one operations array for related changes to a saved document. Each operation has a type and only its applicable fields. Copy sectionId and itemId from saved state; Parcel assigns IDs for new sections and items.

| Type | Fields |
|---|---|
| section.create | name, repeatable; optional description |
| section.update | sectionId; supplied name or description (null clears description) |
| section.delete | sectionId |
| section.move | sectionId, target with exactly one beforeId or afterId |
| section.reorder | orderedIds containing every section ID once |
| field.create | sectionId, key, label, valueType, required |
| field.update | sectionId, fieldKey; supplied label or required |
| field.delete | sectionId, fieldKey, confirmPopulated; true needs confirmation to clear populated values |
| field.move | sectionId, fieldKey, target with exactly one beforeId or afterId field key |
| field.reorder | sectionId, orderedKeys containing every field key once |
| item.create | sectionId, values |
| item.update | sectionId, itemId, values containing only changed fields |
| item.delete or item.duplicate | sectionId, itemId |
| item.move | sectionId, itemId, target with exactly one beforeId or afterId |
| item.reorder | sectionId, orderedIds containing every item ID once |

A field key starts with a lowercase letter and uses lowercase letters, digits, or underscores, up to 48 characters. Keep it stable when changing a label. Use the discovered valueType enum. Clearing an item field requires its empty/default value; omission retains it. Each call accepts up to ten operations against one content revision; a failure saves none of that batch.

## Account Name and Public address

Use `get_account_identity` and `update_account_name` for the optional Account Name. Copy the exact current name into ifName, using an empty string when no name is set. A name change uses its own operationId and leaves saved document names unchanged. Career Profile accountName is current identity metadata, not a Profile field or a historical name. Use the separate Public Resume settings and sharing tools for the Public address; changing that address makes old sharing links stop working.
