# JavaScript API example

This is a disposable synthetic Orders service, not a real work-service specification. [Requirements lab-v1](requirements.md), [OpenAPI 3.0.3](openapi.json) and [approved example cases](approved-cases.json) establish its expectations.

Start with [api.spec.mjs](api.spec.mjs): the POST, independent 250-cent expectation and persisted GET remain visible. [fixtures.mjs](fixtures.mjs) registers owned IDs before requests, isolates request contexts, attempts every cleanup operation and aggregates errors while Playwright retains the test failure. [data.mjs](data.mjs) contains small typed payload/state helpers. The manual schema helper covers this small shape; retain a consuming project's installed validator and dialect.

From the repository root:

```sh
npm run quality
npm run test:api
npm run test:api -- --repeat-each=2 --workers=3
```

The config starts [server.mjs](server.mjs) on loopback port 33177. API_BASE_URL may select an existing disposable instance implementing this same contract. Bearer alice/bob are synthetic principals. No browser is launched. Server state lives in memory and ends with the process.

[mapping.json](mapping.json) preserves original example IDs, clauses, assertions and uncovered gaps. Supplemental price/list probes have no approved Zephyr ID. Its authored execution fields are not a current test report.

The tests and fixture were relocated from tools/qa/lab-tests; the server was simplified from the synthetic lab implementation to healthy behavior, without campaign fault switches. Historical controllers and results are locally archived and are not dependencies. Upstream notices remain with the supporting skill references; [MIT license](LICENSE).
