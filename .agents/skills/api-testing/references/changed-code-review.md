# Simplify changed JavaScript API code

Locally adapted and changed from Anthropic's Code Simplifier agent, under [Apache-2.0](licenses/code-simplifier-APACHE-2.0.txt). [Pinned source and adaptation record](javascript-sources.json). Removed Claude configuration, model selection, React/Props and TypeScript return-type instructions. This is a review procedure within existing QA skills, not a new agent or skill.

1. Identify changed tests/helpers and the contract clauses/Zephyr cases they must preserve. Inspect only enough surrounding code to understand dependencies; keep unrelated refactors out of scope unless broader review was requested.
2. Ask: **Could another QA understand this change, diagnose its failures and extend it using existing examples?** Check names, visible HTTP actions/inputs/oracles, responsibility boundaries and error context. Report an actual debugging/extension cost, not an arrow-versus-declaration preference.
3. Remove redundant indirection or dense nesting where the replacement is clearer. Retain useful helpers for meaningful repetition, fixtures, data ownership and schema validation. Fewer lines are not automatically simpler.
4. Preserve exact contract expectations, independently specified business values, stable-state comparisons, additional-property rules and metadata assertions. Keep permissions/persistence/negative effects and original Zephyr mappings visible. Do not replace precise checks with permissive matchers or swallow genuine product failures.
5. Preserve early registration, per-resource/per-operation cleanup attempts, context disposal, aggregated teardown errors and primary failures. A sequential cleanup loop may express this responsibility better than a fail-fast Promise.all. Keep conditional contract branches explicit; do not delete them merely to satisfy a lint rule.
6. Run focused lint/format/type checks and relevant healthy/fault/failure-teardown controls. State changed behavior, commands, actual results and unverified scope; document only significant choices. Request contract evidence before changing a disputed oracle.

Follow the [project coding standard](javascript.md) and existing function/module conventions. Do not apply the upstream instruction to avoid try/catch when that would break failure-safe teardown, or require function declarations universally. Check-only CI never authorizes automatic source rewrites.
