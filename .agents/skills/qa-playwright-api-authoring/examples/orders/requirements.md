# Orders API contract — revision lab-v1

R1: POST /orders accepts JSON with a caller-assigned nonempty string id, integer quantity 1..10 inclusive, and integer unitPriceCents 1..10000 inclusive. Required fields must be present. Invalid JSON returns 400; invalid fields return 422. A valid new order returns 201 and application/json, with id, quantity, unitPriceCents, totalCents (quantity * unitPriceCents), and owner. For quantity=2 and unitPriceCents=125, totalCents=250. Additional response properties are permitted.
R2: Authorization: Bearer alice or Bearer bob are the only valid credentials. Missing/invalid credentials return 401 on all /orders routes with no mutation. Each user owns only their orders. GET/DELETE of another user's or unknown ID returns 404, with no mutation. Establish owner read-back before foreign access checks.
R3: GET /orders/:id returns 200 and the persisted order to its owner. POST must persist before returning 201. GET /orders returns 200 with {orders:[...]} containing only the authenticated owner's orders.
R4: DELETE /orders/:id returns 204 and removes the owned resource. Subsequent owner GET returns 404. Already absent DELETE returns 404.
R5: POST of an existing id returns 409 and preserves the original object, including across users. No overwrite is allowed.
R6: Rejected POST returns JSON {error:string} and creates no resource. All non-204 responses use application/json. No latency SLA is specified. No idempotency-key, discounts, shipping or currency conversion rules are specified.

The in-memory service is disposable. Use unique caller-owned IDs and delete only your own resources. Credentials above are synthetic lab principals, not real secrets. Base URL is supplied through API_BASE_URL. Use Playwright Test and JavaScript ESM. No browser is needed. Tests must be independent and parallel-safe. No dependency or CI changes are needed.
