---
name: context-engineering
description: Select task-specific service, case, contract, fixture and failure context, refresh stale sources, or prepare a concise handoff for long tasks. Use when context is broad, missing, conflicting or stale; ordinary small edits can read their directly relevant files without invoking a separate context workflow.
license: MIT
metadata:
  author: Addy Osmani
---

# Focused context and handoff

Use this skill when context is broad, stale or conflicting, or a long task needs a handoff. For a small edit, read its directly relevant files.

1. Establish the outcome and acceptance criteria. Identify the relevant service, requirement/API operations, case IDs when applicable, fixture and actual command.
2. Read only needed source sections. Resolve business-rule conflicts before dependent implementation; continue independent work. Missing sources remain unknown.
3. Follow the [context procedure](references/api-context.md) manually. Recheck changed sources; do not treat observed implementation as the agreed contract.
4. Preserve meaningful assertions, cleanup and unresolved failures while summarizing. For long work, save a concise handoff with decisions, working state, actual verification and next action.

Output: the focused context or handoff needed for the task, including material gaps. No context packet or mapping ceremony is required for routine changes.

[Source and adaptation](SOURCE.json); [license](LICENSE).
