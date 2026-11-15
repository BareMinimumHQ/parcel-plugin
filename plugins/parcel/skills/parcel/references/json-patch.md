# Edit saved resources with JSON Patch

Updates to saved resources use RFC 6902 JSON Patch. Follow the discovered update schema for its target, writable resource, limits and prerequisites. Separate create and delete operations manage resources where provided; a Patch can add or remove members inside its selected resource.

## Establish the working copy

Read the selected resource and its writable schema. Keep its complete values, identities and opaque saved-state token locally. A resource schema describes valid fields; it does not reveal saved values, current list positions or ownership. Use the returned index and getter selections to retrieve needed complete items. Paged indexes, partial selections and text fragments are not complete replacement values. Collection paths are canonical positions in the full collection, even on a filtered page; use returned paths rather than a displayed row number.

An absent singleton may return a deterministic unsaved template and a token. Reading it creates nothing. Follow the advertised creation or first-update contract. Do not manufacture missing template fields, tokens or entity IDs.

For documents, keep content and effective presentation together throughout the shared draft-render loop. Work locally, render the complete proposal, revise and render again. A save must preserve both the content and appearance that were measured. Supply the returned rendering basis when required by the operation. Read again only when saved state changed or needed context is missing.

## Describe the intended final content

For a substantial rewrite, first draft the complete intended revised object or array in the working copy. Replace the smallest complete item, section or list that expresses that rewrite. Avoid long sequences of tiny edits to assemble prose. An isolated wording or field correction can still target that field or list member directly.

Patch uses the standard ordered operation array. Each operation sees the result of earlier operations in that request. All six operations are supported; do not invent a different patch format:

| Operation | Standard effect                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `add`     | Add an object member, replace its existing value, or insert into an array at the specified position. |
| `remove`  | Remove an existing member or array element.                                                          |
| `replace` | Replace an existing value with the complete supplied value.                                          |
| `move`    | Remove the value at `from` and add it at `path`.                                                     |
| `copy`    | Copy the value at `from` to `path`.                                                                  |
| `test`    | Require that the current value at `path` equals the supplied value.                                  |

Paths use RFC 6901 JSON Pointers relative to the selected writable resource. The empty string addresses its root. Escape `~` as `~0` and `/` as `~1` inside a key. Array positions are zero-based canonical decimal indices: `0` or a nonzero digit followed by digits, with no leading zeros. `/-` appends with `add`. It is not a general readable position. Removing or inserting an array element shifts later positions, so plan subsequent paths against the resulting array. A move within an array removes its source before resolving the destination insertion. Moves and copies stay within the selected resource and its domain constraints; they cannot cross Accounts or independent resources.

For example, a resource with a `points` array can replace the complete response at `/points/0/response` or append a complete new point at `/points/-`. Use these paths only when the selected schema and current values actually contain that structure.

Omitting a key from a replacement object removes that key from the replacement value; omitting an operation leaves that location unchanged. `null` stores null only where the selected domain schema allows it. It is not a universal unset instruction. Use `remove` for deletion where the final schema permits absence, and use the schema's typed empty value when required. Removing a required field is valid only if the complete final result restores a valid value.

## Preserve identity deliberately

Retain an existing entity's own ID while editing or reordering that same entity within its permitted scope. A wording change does not require a new identity. For a broad rewrite, retain IDs for items that still represent the same entities; omit own IDs for newly created items. A split or combination can create new entities: keep an old ID only when the resulting item still represents that entity. Do not match identity by similar text or reuse an unrelated old ID merely to fill a position.

New entities require unique identities, but the backend assigns their UUIDs when their own IDs are omitted. Never generate entity IDs to satisfy this rule. Duplicate retained IDs, unknown retained IDs and identities moved outside their allowed scope are rejected. Foreign references to saved Jobs, Resumes or other sources are different: preserve the required authorized reference IDs.

`copy` is a literal JSON copy; it does not strip IDs automatically. When cloning an entity, omit its own IDs from the authored copy, or use subsequent standard operations to remove the copied own IDs before final validation. Clear own IDs on nested new entities as well. Preserve foreign references. Keep the source unchanged unless a separate source edit is authorized. An `add` with a complete new value is often simpler than copying and then removing identities.

## Save and recover

Copy `versionToken` unchanged from the relevant complete read or confirmed save. It identifies saved state, not the tool contract. Use a literal `schemaVersion` only where the discovered operation requires it. Generate a fresh UUID `operationId` for one logical mutation; this is a retry key, not an entity ID.

The backend applies the operations to a working copy, validates the final schema, paths, ownership, source references, identities, permissions and capacity, then persists the guarded write and its receipt atomically. A stale token, failed test or invalid final value saves nothing. Temporary intermediate values do not bypass final validation. Independent resources have separate guards; one Patch does not make several resources a single transaction.

After an uncertain write, retry the exact request with the same operation ID, token and operations. An exact retry returns the original result even if saved state later changed. Reusing an operation ID for a different request fails. A corrected or reconciled request is a new logical mutation and needs a fresh operation ID. On conflict, read and reconcile the affected saved state with the local draft; do not discard the draft or force an overwrite.

Use returned assigned IDs, effects and the next token for subsequent work. Confirmed save results establish what was saved; avoid an extra read merely to confirm success. Keep these mechanics out of the person's drafted content and final explanation unless needed to resolve a problem.
