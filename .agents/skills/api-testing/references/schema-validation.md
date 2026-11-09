# Schema policy and independent expectations

Use the consumer's installed validator and declared dialect. This repository installs neither Ajv nor Zod; do not add a library or code generator just to follow an example. The [schema recipe](schema-guidance.md) supplies dialect/version details when configuring validation.

Validate raw required fields/types and additional-property policy before comparing stable business state. Stripping unknown keys cannot establish that forbidden fields were absent. A schema shared with implementation does not independently establish business values or an agreed contract revision.

```js
// Inside an owning test fixture, with a reserved ID; Orders R1/R3.
const persisted = await json(await api.alice.get(`/orders/${id}`), 200);
assertOrderSchema(persisted);
expect(stableFields(persisted)).toEqual({
  id, quantity: 2, unitPriceCents: 125, totalCents: 250, owner: 'alice',
});
```

The [runnable test](../../qa-playwright-api-authoring/examples/orders/api.spec.mjs) supplies setup/cleanup. Its golden 250-cent value comes from requirements. Manual checks cover this small shape, not every OpenAPI constraint. Schema-valid wrong totals still need a failing business assertion.

With existing Ajv, compile the selected response schema once and include validate.errors in the failure message. With existing Zod, include safeParse errors and select strict/loose object policy from the contract. Match installed majors. No dependency migration or zero-maintenance coverage claim is prescribed.

Locally revised from the upstream schema reference recorded in ../SOURCE.json; removed speculative migration/codegen claims and unavailable-tool commands. Read [state details](response-state-cleanup.md) only when needed.
