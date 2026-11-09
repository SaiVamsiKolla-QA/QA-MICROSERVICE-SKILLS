# Evidence-backed review examples

Apply these cues only when the contract and assertions establish a problem. Local adaptation of the original smell reference; upstream hashes remain in ../SOURCE.json. Follow the target runner and fixtures.

## Weak or circular oracles

Truthy bodies, status-only success and implementation-derived expected values can miss wrong results. Orders R1 independently specifies 2 x 125 = 250 cents:

```js
const created = await json(await api.alice.post('/orders', { data: payload(id) }), 201);
assertOrderSchema(created);
expect(stableFields(created)).toEqual({
  id, quantity: 2, unitPriceCents: 125, totalCents: 250, owner: 'alice',
});
```

Reserve id before POST in an owning fixture, then independently read persistence. The [complete test](../../qa-playwright-api-authoring/examples/orders/api.spec.mjs) and [fixture](../../qa-playwright-api-authoring/examples/orders/fixtures.mjs) supply that lifetime. Permitted changing metadata must not invalidate unchanged business state; required schema/metadata constraints still need assertions.

## Vacuous checks and order dependence

Permission assertions gated on receiving 403 can let an unauthorized 200 pass. Assert the documented denial unconditionally, establish owner existence first and verify unchanged state. Similar assertions are not duplicates when inputs, roles or transitions differ.

A list test relying on an earlier create has no independent setup. Use owned mutable data with registered cleanup and only necessary resources. Shared immutable reference data may remain shared. Keep lifecycle requests together when those transitions are the behavior; do not split solely to enforce one assertion per test.

## Playwright tables and diagnostics

```js
// Supplemental boundaries from Orders R1/R6, using its existing owning fixture.
for (const quantity of [0, 11]) {
  test(`rejects quantity ${quantity} without creating state`, async ({ api }) => {
    const id = api.reserve();
    await json(await api.alice.post('/orders', { data: payload(id, { quantity }) }), 422);
    await json(await api.alice.get(`/orders/${id}`), 404);
  });
}
```

Ordinary loops declare Playwright tests. Jest/Vitest test.each, it.each and vi.fn require those actual runners; they are not Playwright APIs. Keep titles, operations, inputs and independent expectations visible. Retain original causes and operation/resource context in errors.

## Scope and coverage

A mocked calculator returning its configured value does not test the rule. Integration tests keep the owned API/database real; virtualize genuine third parties only according to scope. A unit-test fake can help an inaccessible boundary, but injection/interfaces need an observed obstacle; read [testability guidance](testability-refactors.md) only for that distinct finding.

Derive boundaries, permissions and state checks from requirements. Preserve undefined policy or unassigned scope as blocked/uncovered. A green suite proves its executed assertions; use relevant controlled faults rather than invented coverage percentages.
