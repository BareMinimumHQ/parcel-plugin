---
agent:
  instruction: Keep maintainer documentation aligned with packaged manifests and workflow contracts.
  on-change:
    - "plugins/parcel/**"
    - ".claude-plugin/**"
    - ".agents/plugins/**"
---

# Maintainer documentation

The repository root and plugin READMEs are public installation guides. Keep packaging, validation, release, branding, and workflow implementation details here, outside those guides.

- [Branding](branding.md) records approved icon sources and packaging requirements.
- [Workflow contracts](workflow-contracts.md) records the safety and provider boundaries for skill requests.
