---
name: qa-project-context
description: Bootstrap or refresh evidenced QA project facts in .agents/qa-project-context.md when onboarding a consuming automation project, facts are missing or stale, or the user asks to configure project context. Do not require this skill for every small edit.
license: MIT
metadata:
  author: kindlmann
  version: "2.1"
---

# QA project facts

Use this skill to onboard a consuming project or refresh missing/stale facts. It is not a prerequisite for every edit.

1. Read existing .agents/qa-project-context.md if present, package/config/lockfiles and representative fixtures. Preserve custom notes. Distinguish configured commands from observed execution.
2. Record only useful evidenced facts: service purpose, language/framework, test command, CI/environment, authentication variable names, data ownership/cleanup, requirements/API revisions and Zephyr convention if applicable. Cite sources and mark material unknowns. Never copy synthetic example facts into work-service context.
3. Write or update a concise .agents/qa-project-context.md manually using the [context procedure](references/api-context.md). Keep secrets external and service facts in the consuming repository. No manifests or generated sections are needed.
4. Verify relevant facts against current sources. Ask only for gaps that affect correctness; continue unblocked work.

Output: concise sourced project facts, material unknowns and the next useful action. [Upstream examples](references/examples.md) are fictional structure examples, not defaults.

[Source and adaptation](SOURCE.json); [license](LICENSE).
