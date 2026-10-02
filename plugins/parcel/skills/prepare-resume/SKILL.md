---
name: prepare-resume
description: Use when a person asks to prepare, tailor, create, or revise a Job Resume in Parcel.
---

# Prepare a Job Resume

Use the `parcel` MCP tools to read the Job, Saved Job Posting, current Job Resume, Career Profile, and relevant Account Resumes. Use supported experience only. If there is no usable source, ask for the person's experience or a source Resume. Do not invent employment, dates, qualifications, achievements, metrics, or skills. Distinguish the person's evidence from suggestions that need confirmation.

Choose a starting point with the person: retain an existing Job Resume, create a blank structured Job Resume, or copy an Account Resume. Account Resumes and Job Resumes are independent. Never alter an Account Resume as an incidental step in tailoring a Job Resume. Copying a source replaces the Job Resume and needs explicit approval when saved work already exists. Uploaded PDFs are immutable content; do not pretend their fields can be edited. If a structured replacement is needed, use the discovered create/copy operations and explain the proposed replacement before saving.

Confirm which saved Profile or selected Resume is the person's authoritative experience source when they conflict. Treat a reusable source Resume as evidence, never a file to overwrite as an incidental part of tailoring. Map the role's important requirements to concrete experience, outcomes and relevance. Prioritize three to five strong connections rather than repeat every keyword. A comparable tool or platform may demonstrate transferable capability; retain the actual technology and scope used instead of rewriting it as the employer's exact tool or scale. State material gaps honestly and ask for missing evidence.

Prepare a targeted content proposal that emphasizes relevant supported evidence and preserves useful existing content. Show material changes and open questions for review before any save, including creation or copying. After approval, use `create_job_resume`, `copy_account_resume_to_job`, and focused `edit_job_resume` operations as appropriate to the discovered tools. Read returned structured IDs before editing. Full replacement must retain IDs for existing fields, sections and items. Do not change document presentation settings unless requested. Read back the saved Resume, then use `show_document` with `kind: resume` if the person wants to see the PDF.

Use the current content revision and a fresh UUID `operationId` for each logical write. Retry uncertain writes only with their exact original key and arguments. Read and reconcile stale revisions. Do not claim an unsaved proposal is the saved PDF, expose revision browsing, synchronize an Account Resume, publish a Resume, or submit an application.
