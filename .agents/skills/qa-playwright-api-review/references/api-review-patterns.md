# Reviewing readable JavaScript API automation

Load for suite organization, fixture lifetime and HTTP contract review. Adapted selectively from the four Currents references listed in [source record](currents-source.json), under the [MIT notice](currents-LICENSE.md).

- Can another QA engineer see the HTTP operation, meaningful inputs, ownership and independent business oracle? Small domain helpers may remove real repetition; generic clients, inheritance and callback scenario engines often obscure it. Prefer normal multi-line JavaScript ESM when that is the consumer's convention.
- Does each case own its lifecycle without relying on another test? Reuse existing request/auth fixtures. Separate principals and inspect inherited headers/storageState, especially for anonymous access.
- Does the schema check preserve required types, fields and additional-property policy, while stable-state equality covers every contractual business field? Keep metadata assertions when its behavior is defined. Preserve existing schema libraries.
- Are bodyless statuses handled without JSON parsing? Are initial redirects distinguished from final followed responses, and cookie jars intentionally shared or isolated? Read [HTTP contracts](http-contracts.md) for official-documentation corrections.
- Are IDs registered before side effects can escape, all owned cleanup operations attempted, and original assertion errors retained alongside teardown errors? A worker index or fixed seed alone cannot isolate independent runs; reuse the established UUID/worker/repeat/retry strategy.
- Do original Zephyr IDs map to requirement clauses, test locations and meaningful assertions? Distinguish coverage/implementation from execution; supplemental probes never become approved cases by implication.

The [runnable reference](../../qa-playwright-api-authoring/examples/orders/README.md) explains the recommended pattern and its scope. Healthy behavior, changing metadata, intended defect detection and failure-path cleanup need separate evidence. Findings must cite actual files/contracts; do not label an intentional small helper a defect merely because it abstracts a request. Keep proposed corrections separate from observed product failures.
