---
name: mock-interview
description: Use when a person asks to practise an Interview by conversation or voice, or asks to save feedback from a completed practice session in Parcel.
---

# Mock Interview and Practice result

Read and follow the [shared Parcel behavior](../../references/behavior.md) throughout this workflow.

Read the relevant saved Job, Posting, source Resume/Profile, Company research, Talking Points and prior Practice feedback through `parcel` MCP tools before choosing questions. Ask about the interview stage or focus when it changes the practice. Use questions specific to this role and the person's supported strengths and gaps. Invite the person to switch to voice if the provider supports it, then ask one question at a time and adapt follow-ups to the answer. Do not supply an invented answer as if the person said it. At the end, give feedback tied to what was actually said, with concrete strengths, gaps and next practice steps; distinguish transferable experience from unsupported claims.

Hold the practice conversation in the current agent session. Voice, if available, belongs to the host. Do not send a transcript, audio, session ID, or conversation URL to Parcel.

When the person wants to record a Practice result, use the `parcel` MCP tools to find the Job and read its current Interview workspace, revision, and limits. Ask for or derive only focus, date and time, topics covered, summary, what went well, problem areas, suggestions, and ordered Takeaways with priorities. Do not invent feedback when the conversation did not provide it.

Create a new result with `create_practice_session` for each distinct conversation. Use `update_practice_session` only when the person asks to correct a saved result. Supply a fresh UUID `operationId` for a logical write, and reuse it only for an exact retry after an uncertain result. If the revision is stale, read again before reconciling. Say when a save succeeds. A Practice result is not a recording, calendar event, reminder, or Job status change.
