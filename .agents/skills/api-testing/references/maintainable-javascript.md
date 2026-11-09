# Readable JavaScript API suites

Use this reference when organizing or extending a suite. Preserve the consumer's module system and existing fixtures. The runnable ESM lab example is the Orders example in the authoring skill; its synthetic contracts are not work-service requirements.

## Keep the business test visible

Group files by service capability. Use a descriptive case title with the original Zephyr ID; map individual requirement clauses to the test and assertion, not just the endpoint. A test owns its complete scenario, with no dependency on a previous test. A lifecycle scenario can have several requests when those transitions are its business behavior.

Keep HTTP method/path, meaningful request inputs and independent expected values visible at the test or a small domain helper. Prefer normal multi-line JavaScript. Reuse helpers for repeated schema checks, representative payloads and resource ownership. Avoid generic request wrappers, base classes, callback-driven scenario engines, or configuration introduced solely to shorten tests.

```js
import { test, expect, payload, json, assertOrderSchema, stableFields } from './fixtures.mjs';

// Synthetic R1/R3, approved ZEP-101; fixed 250-cent oracle is from requirements.
test('[ZEP-101] creates and persists the correct order total', async ({ api }) => {
  const id = api.reserve(); // owned and registered before POST can have side effects
  const expected = { id, quantity: 2, unitPriceCents: 125, totalCents: 250, owner: 'alice' };
  const created = await json(await api.alice.post('/orders', { data: payload(id) }), 201);
  assertOrderSchema(created); // raw required fields/types; contract permits extra fields
  expect(stableFields(created)).toEqual(expected);

  const persisted = await json(await api.alice.get(`/orders/${id}`), 200);
  assertOrderSchema(persisted);
  expect(stableFields(persisted)).toEqual(expected);
});
```

Schema policy comes from the actual contract. Validate forbidden extra fields before projection; assert defined metadata behavior separately. A partial matcher alone is not a complete schema validator. Never derive a business oracle from the returned object or the service calculator.

## Own lifetime and authentication explicitly

Use the built-in request fixture for one client when its inherited configuration is appropriate. Multiple principals need independently configured APIRequestContexts; an anonymous client must not inherit an Authorization header or saved credentials. Dispose manually created contexts. Browser fixtures and browser installation are unnecessary for request-only suites.

Prefer test-scoped mutable resources. Put context setup and `await use(...)` inside try/finally so partial setup is disposed too. Register caller IDs before POST; for server-assigned IDs register immediately upon obtaining them and explain recovery when setup may succeed without returning an ID. Attempt each resource's deletion and absence check independently, then dispose all contexts and report aggregated errors alongside any primary failure. Use the full local response-state-cleanup.md pattern rather than cleanup only at the end of a passing body.

Worker indices distinguish workers within a run, not independent CLI invocations. Combine run uniqueness, test/worker/repeat/retry identity with owned IDs; record the identity in evidence. Keep payload values deterministic and allow explicit overrides. A module counter, timestamp alone, title length or fixed random seed alone does not establish globally unique ownership. Fixed golden business values are useful; uniqueness belongs in identifiers, not arbitrary monetary expectations.

For boundary tables, use ordinary `for ... of` to declare descriptively named Playwright tests, or loop inside one approved case when that is its reviewed scope. Record which clause each value checks. Do not invent extra approved cases, add a data generator dependency, or randomize the oracle.

For bodyless responses, redirects or cookie authentication, read [HTTP contracts](http-contracts.md). For the reviewed runnable pattern and its scope, see the [reference example](../../qa-playwright-api-authoring/examples/orders/README.md). Keep existing schema libraries unless a demonstrated contract requirement warrants a change.

## Source and deliberate adaptations

Adapted selectively from Currents Software Inc., playwright-best-practices-skill, MIT; see currents-LICENSE.md and currents-source.json. Reviewed paths: testing-patterns/api-testing.md, core/fixtures-hooks.md, core/test-suite-structure.md, core/test-data.md under playwright-best-practices/.

Retained request-context fixtures, direct assertions, independent feature grouping, fixture teardown, simple factories/overrides and parameterized tables. Converted examples to JavaScript ESM and existing local exports. Replaced module counters/timestamp IDs, shared mutable setup and cleanup after success only with reserved ownership and failure-safe teardown. Added independent business oracles, stable-state/schema separation and Zephyr clause mappings. Did not import browser/POM, mocking of the API under test, Faker, database rollback, generic clients, unsupported latency claims or speculative project configuration.

Technical checks against official Playwright documentation (reviewed 2026-11-09 UTC):

- [API testing](https://playwright.dev/docs/api-testing): request contexts, baseURL and request data/headers.
- [Fixture execution order](https://playwright.dev/docs/test-fixtures#execution-order): dependencies and test-scoped teardown after use.
- [Request-context disposal](https://playwright.dev/docs/api/class-apirequestcontext#api-request-context-dispose): releases responses; it does not delete server resources.
- [Parallel identities](https://playwright.dev/docs/test-parallel#worker-index-and-parallel-index) and [TestInfo](https://playwright.dev/docs/api/class-testinfo): worker restart indices, repeatEachIndex, retry and attachments.
- [Parameterization](https://playwright.dev/docs/test-parameterize): loops declaring separate tests; no Jest-style test.each dependency.

Aggregate cleanup continuation and retention of primary errors are local requirements verified by executable fault controls, not guarantees attributed to the upstream snippets.
