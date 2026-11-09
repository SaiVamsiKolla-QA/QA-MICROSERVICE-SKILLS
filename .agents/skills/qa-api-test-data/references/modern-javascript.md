# Selected modern JavaScript patterns for API QA

Locally adapted from Seth Hobson's Modern JavaScript Patterns; changed for this repository's JavaScript Playwright API conventions. [Source/revision](javascript-sources.json), [MIT notice](licenses/wshobson-MIT.txt). This supporting reference is not another authoring skill.

Use purposeful names such as `ownedOrders`, `expectedTotalCents` and `cleanupErrors`; distinguish a response from its parsed body. Keep small responsibilities such as payload construction or schema checks separate without hiding the test's business action. Preserve existing ESM exports/import extensions; do not convert a consumer's module system just to match an example.

Use async/await for readable dependent workflows. Returning a promise is valid when the caller awaits it. Avoid async forEach callbacks whose promises are discarded. Promise.all is useful for independent reads; it rejects early, so use separate catches or allSettled and inspect every outcome when all cleanup attempts must finish. Do not parallelize dependent writes or use retries to hide product failures.

```js
const created = await owner.post('/orders', { data: input });
expect(created.status()).toBe(201);
const persisted = await owner.get(`/orders/${input.id}`);
expect(persisted.status()).toBe(200);
// Validate schema and every stable contractual field against the independent oracle.
```

Keep const by default and let for changing loop/state values. Use small callbacks where helpful; choose declarations when they make a responsibility easier to name. Simple loops are often clearer for ordered requests and all-attempt cleanup. Do not mandate arrows, immutability copies, pipelines, pure functions or array methods for every operation.

Preserve original errors when adding context:

```js
try {
  await owner.delete(`/orders/${id}`);
} catch (cause) {
  cleanupErrors.push(new Error(`cleanup DELETE order ${id}`, { cause }));
}
```

This catch belongs inside the established all-resource cleanup loop; it must not end cleanup early or replace the original test failure. Do not return empty objects after parsing/request failures. Optional chaining/defaults are useful for genuinely optional values, not for concealing missing required response fields.

Local exclusions: upstream broad preferences for arrows, array methods and mutation avoidance are choices rather than gates. ESM already has strict-mode semantics. No class hierarchy, composition framework, retry wrapper, performance utility or deep-cloning recipe is imported without a current need. The canonical [coding standard](javascript.md) takes precedence.
