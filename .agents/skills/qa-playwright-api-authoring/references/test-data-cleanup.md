# Reproducible data and failure-safe cleanup

Read the target project's fixtures before implementation. Keep immutable payload values separate from mutable identity. Build namespaces from explicit RUN_ID + worker/parallel index + repeat + retry + case. Record all components so the payload can be replayed. Give simultaneous invocations distinct RUN_ID values. Use independently reviewed golden values; fixed payloads do not require a seeded RNG.

Reserve a caller-owned resource ID **before** POST, so failed creates with possible side effects can be cleaned up. Put owned IDs in a test-scoped fixture. In finally, attempt every ID and aggregate errors before failing teardown; the first cleanup failure must not prevent remaining cleanup attempts. DELETE 404 may be accepted when the contract allows absence, but verify owner GET 404 too. Verify inventory only for the current run namespace. Never truncate or reset a shared environment.

```js
// Inside a Playwright fixture: owned contains { id, owner } reserved before POST.
// contexts contains only manually created clients, registered as setup succeeds.
// Fixture arguments provide use and testInfo. Keep partial setup inside this try.
try {
  await use({ owner, owned });
} finally {
  const errors = [];
  const attempts = [];
  for (const { id, owner } of owned) {
    for (const operation of ['delete', 'get']) {
      try {
        const response = await owner[operation](`/orders/${encodeURIComponent(id)}`);
        attempts.push({ id, operation, status: response.status() });
        if (operation === 'delete') expect([204, 404]).toContain(response.status());
        else expect(response.status()).toBe(404); // lab contract: verify absence
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);
        errors.push(new Error(`cleanup ${operation} ${id}: ${message}`, { cause }));
      }
    }
  }
  for (const context of contexts) {
    try {
      await context.dispose();
    } catch (cause) {
      errors.push(new Error('dispose request context', { cause }));
    }
  }
  try {
    await testInfo.attach('owned-resource-cleanup', {
      body: Buffer.from(JSON.stringify({ attempts, errors: errors.map(error => error.message) })),
      contentType: 'application/json',
    });
  } catch (cause) {
    errors.push(new Error('attach cleanup evidence', { cause }));
  }
  // Playwright retains body errors and adds this fixture teardown error.
  if (errors.length) throw new AggregateError(errors, errors.map(error => error.message).join('\n'));
}
```

This is fixture teardown, not a general finally template. In ordinary JavaScript, capture the primary exception and report it together with cleanup errors after all attempts; throwing only from finally would replace it. For the complete setup lifetime, use the maintained fixture linked below.

For server-assigned IDs, capture IDs from successful responses and use a documented searchable run namespace for ambiguous POST outcomes; do not assume caller-assigned IDs exist. Respect documented eventual-consistency windows with bounded condition polling; do not turn an arbitrary sleep or retry into proof of cleanup.

Run a test alone, repeated/parallel, then with an intentionally failing assertion after successful creation. Audit remaining resources afterward. [Lab fixture](../examples/orders/fixtures.mjs) demonstrates aggregated cleanup. The example does not establish cleanup behavior in a consuming service.
