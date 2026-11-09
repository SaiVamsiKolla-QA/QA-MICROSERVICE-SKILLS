# Small JavaScript data factories and owned resources

Load when implementing/extending factories and fixtures. Adapted from Currents core/test-data.md and core/fixtures-hooks.md with supporting API/suite guidance; [source record](currents-source.json), [MIT notice](currents-LICENSE.md).

Use the consumer's existing factory/auth strategy. Plain payload defaults plus explicit overrides are enough when the domain is small:

```js
export const orderPayload = (id, overrides = {}) => ({
  id, quantity: 2, unitPriceCents: 125, ...overrides,
});
// R1's independently documented total is 250, not a value computed by the service.
```

Immutable golden values help reproducibility. Mutable IDs need the existing isolated namespace (run/test/worker/repeat/retry or recorded UUID ownership). Module counters, timestamps, title length and deterministic seeds alone can collide across processes; a seeded payload is not an ownership policy. Do not add Faker or a builder framework just to replace a literal.

Reserve caller IDs before POST, including rejected-create probes; register server IDs as soon as known and document recovery for uncertain setup outcomes. Put partial setup inside the protected fixture lifetime. Attempt each resource's delete and absence check even if another operation fails, dispose every context, then report collected failures while retaining the original test error. Delete only owned resources; context disposal alone does not delete backend data. Use reverse dependency order where resources actually depend on one another.

Use ordinary named Playwright tests or approved-case loops for documented boundary tables. Keep expected calculations independent and units explicit. Do not infer missing policy or silently expand Zephyr approval scope.

The [runnable ESM fixture and reference test](../../qa-playwright-api-authoring/examples/orders/README.md) reuse the repository's UUID/worker/repeat/retry ownership strategy and aggregate cleanup. Its fixed payload values describe the synthetic lab, not a downstream service. Local adaptations replace upstream counters, shared mutable setup, server-derived expected values and success-only cleanup; no schema dependency or module-system migration.
