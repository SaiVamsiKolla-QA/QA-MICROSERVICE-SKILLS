# API authentication and assertions

Use the project's real config, fixtures and contract; the lab's alice/bob tokens are synthetic, not a production auth recipe. Use the target project's existing test command.

Create clients independently so the anonymous context cannot inherit default Authorization. Acquire login tokens from the application's documented endpoint only if supported. Store secrets in process env or an approved secret manager, not test code or reports. This ordinary JavaScript lifetime retains setup/scenario errors and attempts every owned disposal. Validate required environment variables before requests; a login cookie does not establish bearer-token support. In an existing Playwright fixture reuse its established lifetime instead:

```js
const clients = [];
const errors = [];
try {
  const owner = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: { Authorization: `Bearer ${process.env.API_TOKEN}` },
  });
  clients.push(owner);
  const anonymous = await playwright.request.newContext({
    baseURL: process.env.API_BASE_URL, extraHTTPHeaders: {},
  });
  clients.push(anonymous);
  // Run the scenario assertions here.
} catch (error) {
  errors.push(error); // retain the original setup or scenario failure
} finally {
  for (const client of clients) {
    try {
      await client.dispose();
    } catch (cause) {
      errors.push(new Error('dispose request context', { cause }));
    }
  }
}
if (errors.length === 1) throw errors[0];
if (errors.length > 1) {
  throw new AggregateError(errors, errors.map(error => error.message).join('\n'));
}
```

For the Orders lab, R1 independently establishes quantity=2, price=125 and total=250. Assert 201, JSON content-type, required field types and exact business values; then immediately owner-GET and assert 200 with those same **contractual fields**. Use `toMatchObject` or an explicit projection, not whole-body equality over extra response metadata:

```js
const stable = body => Object.fromEntries(
  ['id', 'quantity', 'unitPriceCents', 'totalCents', 'owner'].map(k => [k, body[k]])
);
expect(stable(after)).toEqual(stable(before));
```

Project contracts may require more or fewer stable fields; derive that projection from evidence. An added changing response timestamp is permitted when additionalProperties allows it. Verify owner existence before foreign GET/DELETE; require the documented denied status, then confirm owner state is unchanged. For rejected creates, verify the reserved ID remains absent. Preserve case IDs in test titles/annotations and a mapping with requirement revision, assertion and blocked/unrun clauses. Do not import the implementation's calculator as the expected-value oracle.

Runnable example: [API regression tests](../examples/orders/api.spec.mjs), [fixtures](../examples/orders/fixtures.mjs). These are lab-specific examples, not automatic modifications to consumer tests.
