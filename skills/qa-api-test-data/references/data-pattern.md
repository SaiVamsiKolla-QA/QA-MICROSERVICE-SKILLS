# Deterministic values and unique ownership
Payload: `{ id: namespace + '-order', quantity: 2, unitPriceCents: 125 }`. Independently reviewed golden expected total: 250 cents. Payload values are fixed; namespace includes a recorded run UUID and the test's repeat/retry/parallel identity. Replaying the namespace reproduces the payload, but choose a new namespace for concurrent runs.

Reserve ID before POST; fixture teardown DELETEs that exact ID even if POST or an assertion fails, then GET must return 404. A 404 cleanup is allowed only when absence is expected and verified. Other cleanup failures fail the run. Never use a shared reset endpoint in a consumer environment. Check a run-scoped inventory for leaks after workers finish.
