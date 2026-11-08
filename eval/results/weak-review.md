# Applying qa-playwright-api-review to weak.spec.js
Reviewed file: eval/weak/weak.spec.js. These are author observations, supported where noted by executed controls.

- High, lines 4–5: response.ok() accepts any 2xx and checks no schema or business value. Content and schema fault runs both pass. Replace with documented 201, required field/type checks and independent totalCents=250 from R2; read back persisted state under R1/R3. State fault also passes.
- High, line 9: if(response.ok()) skips every assertion when GET returns 404/500. In the state fault the resource is never persisted and the entire suite still passes. Require 200 before parsing and assert exact documented values.
- High, lines 2, 4 and 8: shared-order couples tests, repeats and runs. Healthy repeat execution produces two duplicate-create failures. Generate per-test IDs, create prerequisites in each test fixture and run independently.
- High, lines 3–10: no teardown. Inventory shows one leaked resource for healthy/content/schema/authorization runs. Register fixture cleanup before yielding and verify 404 after deletion, including after assertion failure.
- Medium, lines 3–10: neither case/requirement mapping nor permission checks. Authorization fault survives. Add traced case IDs and foreign GET/DELETE checks with independent state read-back.

Passing development replacements detect these four local faults and leave zero resources. This does not establish a general mutation score. The weak suite is a deliberately different artifact, not a same-task no-skill agent baseline.
