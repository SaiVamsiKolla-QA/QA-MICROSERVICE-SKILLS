# Contract-aware schema validation

Inspect package.json and its lockfile first. Use installed dependencies; no schema library is required by these examples. Preserve upstream skill examples, but adapt their dialect, strictness and version rather than treating their sample schema as your contract.

- For an existing Ajv installation, use the constructor supporting the declared JSON Schema dialect. Ajv's default constructor targets draft-07; draft-2020-12 requires the corresponding constructor. OpenAPI 3.0 Schema Objects have differences such as nullable; do not blindly compile an entire OpenAPI document as JSON Schema. Resolve/translate the relevant response schema through the project's existing adapter.
- Compile once and report validation.errors with `expect(valid, JSON.stringify(validate.errors)).toBe(true)`. Do not enable coercion/removal that hides actual returned values during contract assertions.
- For existing Zod, match its installed major. Zod 4 has native `z.email()`/`z.uuid()`. `z.object` strips unknown keys from parsed output by default; `z.strictObject` rejects them and `z.looseObject` retains them. Choose policy from the contract; do not confuse parsing/stripping with detecting forbidden fields. The older upstream paragraph about changed coerce syntax is not a reason to migrate dependencies.
- Without a schema library, check each required field/type and relevant nested structure directly using Playwright assertions. Check exact key sets only when the contract forbids additional properties. Report that this is targeted manual validation, not complete OpenAPI validation.

Keep business checks independent: a schema-valid total of 251 still violates the lab's known 250-cent requirement. Include healthy and invalid-type/missing-field controls. The lab's [fixture helper](../examples/orders/fixtures.mjs) checks exact required values for its fixed inputs, which also constrains their types. It is not a general schema engine.

Sources: [Ajv](https://ajv.js.org/json-schema.html), [Zod objects](https://zod.dev/api#objects).
