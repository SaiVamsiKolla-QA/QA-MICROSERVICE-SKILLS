# Contract-grounded API examples

These JavaScript examples use Orders requirements lab-v1. Adapt inputs, statuses and schema policy to the consumer; do not add endpoints or budgets from an example. Reuse its owning fixture.

## Creation and persistence

```js
import { test, expect, payload, json, assertOrderSchema, stableFields } from './fixtures.mjs';

test('[ZEP-101] creates and persists the documented total', async ({ api }) => {
  const id = api.reserve(); // cleanup registered before POST can have effects
  const expected = { id, quantity: 2, unitPriceCents: 125, totalCents: 250, owner: 'alice' };
  const created = await json(await api.alice.post('/orders', { data: payload(id) }), 201);
  assertOrderSchema(created);
  expect(stableFields(created)).toEqual(expected);

  const persisted = await json(await api.alice.get(`/orders/${id}`), 200);
  assertOrderSchema(persisted);
  expect(stableFields(persisted)).toEqual(expected);
});
```

The [maintained fixture](../../qa-playwright-api-authoring/examples/orders/fixtures.mjs) attempts every owned DELETE and absence GET, disposes all contexts and retains primary and teardown failures. Its json helper is for documented JSON bodies. Read [state/cleanup details](response-state-cleanup.md) when implementing that responsibility.

## Rejected input has no side effects

```js
// Supplemental R1/R6 coverage; no invented approved Zephyr case ID.
for (const quantity of [0, 11]) {
  test(`rejects quantity ${quantity} without creating state`, async ({ api }) => {
    const id = api.reserve();
    await json(await api.alice.post('/orders', { data: payload(id, { quantity }) }), 422);
    await json(await api.alice.get(`/orders/${id}`), 404);
  });
}
```

These adjacent invalid boundaries do not cover missing fields, malformed JSON or other invalid types. Keep uncovered clauses visible. Playwright uses ordinary loops to declare tests; Jest test.each is not a Playwright API.

## Other supported capabilities

- For permissions, establish owner existence first, use independent clients, assert the exact denial and verify unchanged owner state. See the [runnable cases](../../qa-playwright-api-authoring/examples/orders/api.spec.mjs).
- Orders DELETE returns 204 with an empty body, followed by GET 404. Do not parse it as JSON. Read [HTTP contracts](http-contracts.md) for redirects/cookies when relevant.
- For pagination, seed a known owned set and assert documented membership and boundaries. A large page number does not guarantee an empty page in shared data.
- Rate-limit checks need a documented identity/window and exact refusal/header expectations. An arbitrary concurrent burst does not establish that a limit was exercised.
- Add file, GraphQL or webhook tests only for supported operations. Register every created object, including subscriptions, for failure-safe cleanup. Correlate asynchronous events to owned input; poll within a documented consistency window and await any test-owned listener shutdown. No listener infrastructure is prescribed here.
- Performance checks need an agreed measurement method and budget. Orders has no SLA. Under concurrency assert precise contract statuses; a range permitting 4xx can hide failed requests.

Locally revised from the upstream API reference recorded in ../SOURCE.json: removed unsupported generic snippets, fixed waits/budgets and success-only cleanup. Original source hashes are retained in the source record.
