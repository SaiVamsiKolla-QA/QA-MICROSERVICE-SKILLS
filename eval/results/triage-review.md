# Applying qa-api-failure-triage to observed controls
Evidence: development-*.json embedded request data-recipe and response attachments, corresponding *-service.json event/inventory snapshots, and triage-controls.json direct HTTP reproductions. Sources: examples/service/requirements.md revision 1. Local synthetic environment, Node 22.12.0, Playwright Test 1.65.0. Reproduce the whole capture with `node scripts/triage-controls.mjs`; fault names are known experimental controls, not inputs to an automated classifier.

## Incorrect response content
Observation: alice POST quantity 2, unitPriceCents 125 returns 201 totalCents 251; direct read-back returns 250. R2's independent example requires 250. Healthy control returns 250.
Classification: likely Product defect, high confidence in this local service. Hypothesis: response-only calculation/serialization fault, supported by correct persisted total; production root cause still requires implementation/log evidence.
Draft: “Order creation returns a total one cent above documented price.” Create an isolated order as alice with the payload above; inspect 201 JSON then GET the same ID. Expected both totals 250, actual create 251/read 250. Impact: consumers trusting create response receive an inconsistent monetary value.

## Missing schema field
Observation: POST 201 response lacks owner; required-field assertion sees undefined. Persisted GET includes owner alice. R1 requires owner in both. Healthy control includes it.
Classification: likely Product defect, high confidence locally. Hypothesis: response projection drops required owner. Draft: “Create order omits required owner field.” Reproduction matches content control, using FAULT=schema; expected owner alice in POST body, actual absent. No unsupported downstream impact is asserted.

## Broken authorization
Observation: bob GET on alice's established resource returns 200 with alice's data; bob DELETE returns 200 deleted true. Owner data is consequently absent. R3 requires both foreign operations return 403 without mutation. Healthy direct control establishes persisted existence.
Classification: likely Product defect, high confidence locally. Draft: “Foreign principal can read and delete another owner's order.” Create as alice, GET/DELETE as bob, then GET as alice. Expected 403/403 with unchanged order; actual data disclosure and deletion. Local impact is cross-owner confidentiality/integrity loss.

## Incorrect state changes and cascading failures
Observation: POST 201 followed by owner GET 404; captured server event says persisted=false. ZEP-2 detects this. ZEP-3 also sees 404 for bob, and ZEP-6 fails its existence precondition. R1 requires successful creation to persist the order.
Classification: likely Product defect in persistence, high confidence locally. Do not count each failing test as a separate defect or call the bob 404 an independent authorization defect. Hypothesis: create acknowledgement without storage. Draft: “Successful order creation does not persist the resource.” POST then owner GET; expected readable 200, actual 404. Next real-system check: trace commit/storage event and target instance/consistency contract.

## Automation oracle control
Observed healthy create total 250; intentionally incorrect test expectation 200 contradicts R2. Classification: Automation defect, high confidence for this explicit oracle. Correct the expected value using R2, rerun healthy and content fault. Do not change service behavior to satisfy the wrong assertion. ZEP-8's contradictory manual case is a similar review problem, not a product failure.

## Environment control
Observed closed-port request fails with ECONNREFUSED and no HTTP response. Classification: Environment failure for this controlled unavailable local target. No evidence that business behavior ran. Next check: process/port/base URL and service readiness. In a real environment, a connection error alone cannot distinguish deployment downtime from a bad automation URL.

## Unresolved example
HOLD-3 expects a regional tax but supplies no rate/jurisdiction/rounding requirement or observed API response. Classification: Unresolved; missing oracle evidence. No tax defect should be filed. Obtain source requirements and a worked example before authoring an assertion.

These are in-session reasoned analyses of local evidence, not measured autonomous triage accuracy. No tickets were created.
