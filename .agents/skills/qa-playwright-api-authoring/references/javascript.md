# JavaScript QA coding standard

Use this standard when changing JavaScript API automation or shared tooling. Another QA engineer should understand the scenario, diagnose a failure and add a similar test from the existing example.

- Use purposeful domain names and straightforward control flow. Prefer `const`; use `let` for reassignment. Match the existing module system (this repository uses ESM with explicit local extensions).
- Await asynchronous work or return its promise to the caller. Run operations concurrently only when independent; await all outcomes when every operation must be attempted. Keep dependent create/read/delete operations ordered.
- Keep functions responsible for one clear job. Extract helpers for meaningful duplication or a real responsibility, while keeping HTTP actions, important inputs and expected business results visible.
- Ground statuses, schemas, permissions and business effects in the contract. Use independently established expected values. Validate raw schemas/additional-property policy separately from stable business-state comparisons; retain contract-defined metadata assertions and bodyless response handling.
- Add useful operation/resource context to errors and preserve their original causes. Aggregate teardown failures after every owned cleanup attempt; retain the original test failure too. Never swallow a failure or weaken an oracle to make a run green.
- Explain business rules, constraints and surprising decisions in comments. Avoid comments that merely narrate syntax. Add JSDoc at shared fixture/client/data boundaries where it clarifies inputs, ownership or return values.
- Make focused changes and reuse established fixtures, authentication, namespaces, schema validators and dependencies. Preserve Zephyr IDs and clause mappings.
- Avoid dense expressions, nested ternaries, speculative frameworks, wrappers around every request, unnecessary inheritance and unrelated cleanup refactors. Choose arrows/declarations and loops/array methods for the local responsibility; no syntax style is universally required.


Read only the supporting guidance relevant to the change. Use the target project's existing lint, format and test commands.
