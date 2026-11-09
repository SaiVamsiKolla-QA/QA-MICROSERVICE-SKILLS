# Stable business state, schema checks and cleanup

Adapt fields, statuses and ownership to the supplied contract. These Orders examples use documented required fields id, quantity, unitPriceCents, totalCents and owner, while extra response properties are permitted. Schema checks and business-state comparisons are separate operations. Do not import the service implementation as an oracle.

## Validate first, then compare the documented stable projection

```js
import { expect } from '@playwright/test';
const businessKeys = ['id', 'quantity', 'unitPriceCents', 'totalCents', 'owner'];
export function assertOrderSchema(body) {
  expect(body).not.toBeNull();
  expect(typeof body).toBe('object');
  expect(Array.isArray(body)).toBe(false);
  expect(body.id).toEqual(expect.any(String));
  for (const key of ['quantity', 'unitPriceCents', 'totalCents']) {
    expect(Number.isInteger(body[key]), `required integer ${key}`).toBe(true);
  }
  expect(['alice', 'bob']).toContain(body.owner);
  // No exact key-set assertion: this example's contract allows extra properties.
}
export function stableOrder(body) {
  return Object.fromEntries(businessKeys.map(key => [key, body[key]]));
}
const expected = { id: 'owned-1', quantity: 2, unitPriceCents: 125,
  totalCents: 250, owner: 'alice' }; // independently specified contract example
const created = { ...expected, servedAt: 1 };
const readBack = { ...expected, servedAt: 2 };
assertOrderSchema(created);
assertOrderSchema(readBack);
expect(stableOrder(created)).toEqual(expected);
expect(stableOrder(readBack)).toEqual(expected); // metadata changes; persisted values do not
```

This is a positive projection of **all documented stable business fields**, not an instruction to delete servedAt or ignore arbitrary mismatches. Missing owner or a total of 251 must still fail. If the contract defines servedAt's type, timestamp format, freshness, monotonicity or stability, assert those separately. If additional properties are forbidden, validate that policy before comparison; do not project forbidden fields away. Use the project's existing schema validator and actual dialect when available; otherwise state the limits of targeted manual shape/type checks. Do not coerce the response, discard unknown fields in a parser before policy validation, or reuse the implementation's expected calculations.

## Apply the same rule throughout the lifecycle

```js
async function orderResponse(response, status) {
  expect(response.status()).toBe(status);
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  assertOrderSchema(body);
  return body;
}
async function createAndRead(owner, payload, independentlyExpected) {
  const created = await orderResponse(await owner.post('/orders', {data: payload}), 201);
  expect(stableOrder(created)).toEqual(independentlyExpected);
  const persisted = await orderResponse(await owner.get(`/orders/${payload.id}`), 200);
  expect(stableOrder(persisted)).toEqual(independentlyExpected);
  return stableOrder(persisted);
}
// For a rejected duplicate/update or unauthorized request:
const before = await createAndRead(owner, payload, expected);
const rejected = await owner.post('/orders', {data: {...payload, quantity: 3}});
expect(rejected.status()).toBe(409); // this lab's documented duplicate contract
expect(rejected.headers()['content-type']).toContain('application/json');
expect(await rejected.json()).toMatchObject({error: expect.any(String)});
const after = await orderResponse(await owner.get(`/orders/${payload.id}`), 200);
expect(stableOrder(after)).toEqual(before);
```

Use the same schema-then-stable-state approach for foreign GET/DELETE checks, rejected updates, retries, idempotency and any other full-object comparison. Establish owner read-back first, assert the documented denial/error status and body, then verify required business state or effects. For accepted updates, assert the specified changed values and unchanged invariant fields rather than requiring the entire pre-update state. The lab has no PATCH endpoint; do not invent one.

## Cleanup every reserved ID and retain primary failures

Register resources before POST, including requests expected to be rejected. Track the owning client as well as ID. Each operation and each resource needs its own error handling; a failed DELETE must not suppress that resource's read-back, later IDs, other principals' cleanup, or context disposal.

Use the [maintained fixture](../../qa-playwright-api-authoring/examples/orders/fixtures.mjs) for complete protected setup and teardown. The [cleanup recipe](test-data-cleanup.md) is the short tested fixture-teardown example. Read one implementation when changing cleanup, not both by default. Retain original error causes and the test-body failure alongside aggregate teardown errors. Ordinary try/finally must explicitly retain its primary exception; a finally throw alone replaces it. Verify with multiple resources, a failed DELETE request/assertion, and a failing test body.

## Coverage mapping contract

Emit mapping.json as an object with schemaVersion:1, scope and rows. Use one row per requirement clause/case assertion; multiple rows may share a requirement or case ID. Do not mark an entire multi-clause requirement covered from a single assertion.

```json
{
  "schemaVersion": 1,
  "scope": "Only the seven approved cases; not a whole-contract claim",
  "rows": [
    {
      "requirementId": "R1",
      "clause": "creation total",
      "zephyrCaseId": "ZEP-101",
      "testFile": "tests/orders.spec.js",
      "testTitle": "[ZEP-101] create order",
      "assertion": "stableOrder(body).totalCents equals independently specified 250",
      "coverage": {"status": "covered", "reason": "Assigned case has direct assertions"},
      "implementation": {"status": "implemented", "reason": "Executable test authored"},
      "execution": {"status": "not-run", "command": null, "evidence": null}
    },
    {
      "requirementId": "R1",
      "clause": "unitPriceCents invalid boundaries",
      "zephyrCaseId": null, "testFile": null, "testTitle": null, "assertion": null,
      "coverage": {"status": "uncovered", "reason": "Outside the seven assigned cases"},
      "implementation": {"status": "not-implemented", "reason": "Not assigned"},
      "execution": {"status": "not-run", "command": null, "evidence": null}
    },
    {
      "requirementId": "R3", "clause": "owner-list isolation",
      "zephyrCaseId": null, "testFile": null, "testTitle": null, "assertion": null,
      "coverage": {"status": "uncovered", "reason": "Outside the seven assigned cases"},
      "implementation": {"status": "not-implemented", "reason": "Not assigned"},
      "execution": {"status": "not-run", "command": null, "evidence": null}
    }
  ]
}
```

Coverage status is covered/partial/uncovered/blocked with reasons; implementation is implemented/not-implemented/blocked. Execution is passed/failed/skipped/blocked/incomplete/not-run, recorded independently with command and evidence path. Update execution only after observed results; an implementation remains implemented when its test fails. Preserve original mapping entries and retain run-specific evidence rather than overwriting historical executions. Include other untested clauses too (e.g. malformed JSON or invalid tokens). Keep price validation and owner-list isolation explicitly uncovered when outside assigned cases. A green seven-case run is not whole-contract coverage.
