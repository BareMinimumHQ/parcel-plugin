---
name: assess-match
description: Use when a person asks to assess a Parcel Job against their Job Preferences or create its Match.
compatibility: Requires an authorized Parcel MCP connection. Browsing and independent reviewer dispatch depend on the host.
---

# Assess a Match

Read and follow the [shared Parcel behavior](../../references/behavior.md) throughout this workflow.

Use the `parcel` MCP tools to read the current Job, Saved Job Posting, Job Preferences, and Match. If a posting or meaningful preferences are missing, explain what is needed before scoring. Copy Priority IDs and current revisions from reads; never invent record IDs. An existing Match uses captured posting and preference snapshots: assess those sources, and explain changed-source indicators before proposing a rebase. Do not silently rebase or clear saved assessments.

Assess each configured Filter using the discovered outcome enum. Compare its preference value with explicit posting evidence; distinguish no match, not stated, and unclear. Add a concise `rationale` when it explains an outcome or uncertainty. Do not infer compensation, location, seniority, or working arrangements without support.

Score supported Priorities on the tool's 1–5 scale, where higher means a closer fit to the stated preference. Include `rationale` for every scored Priority: the source facts, why they support that score, and any evidence gap. Leave a Priority unscored when evidence is insufficient rather than assign a neutral guess. Use the person's Priority descriptions and weights without changing them. Estimated Match is Parcel's calculation, not a hiring probability; Filters do not contribute to it.

Use each saved Priority's description as its scoring rubric. Where useful, explain what low (1), moderate (3), and strong (5) evidence would mean for that specific preference. Score the opportunity the role offers, rather than the candidate's qualifications, unless that Priority explicitly asks otherwise. Do not introduce a universal rubric, change weights, or copy another person's preferences. Missing evidence stays unscored; absence of a salary range is a source gap, with any stricter pass/fail policy coming from the person's explicit requirements.

When discussing personal fit alongside the assessment, distinguish a transferable implementation gap from a missing underlying capability. A different vendor, framework, terminology, or moderate scale can have a defensible equivalent in the person's experience. A missing central responsibility, specialization, substantial management history, or materially greater ownership is a substantive gap. Explain the concrete evidence and concern. Do not disguise a gap by inventing or exaggerating experience, and do not reject a credible reach solely for a tool-name mismatch. Keep this personal-fit discussion separate from Parcel's Job Preference scores.

Show the assessment and supporting evidence for review. When the person authorizes saving, call `save_match` with the current Match revision (0 if absent), discovered fields, complete retained Filter assessment and Priority score collections, and a fresh UUID `operationId`. Omitted entries are removed. If the person explicitly approves updating captured sources, use the discovered rebase operation first, then read the new Match and assess its new snapshots. Report what was actually saved. Retry an uncertain write only with its exact original key and arguments; read and reconcile stale revisions.
