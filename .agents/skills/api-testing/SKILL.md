---
name: api-testing
description: Design and extend broader endpoint and API-contract coverage with Playwright request tests. Use qa-playwright-api-authoring to implement reviewed approved Zephyr cases.
---

# Microservice API testing

Read the target project's AGENTS.md, optional `.agents/qa-project-context.md`, package lockfile, Playwright configuration, representative tests, and auth/data fixtures. Follow its existing language and conventions. Use the requirements and Swagger/OpenAPI revision as the oracle; report conflicts and blocked cases instead of guessing business rules.

## Workflow

1. Select requirement clauses and API operations for the requested coverage. Preserve existing Zephyr IDs and mappings where applicable; general probes need no invented approved case ID. Use qa-playwright-api-authoring instead for a reviewed approved-case handoff.
2. Use the request fixture or isolated APIRequestContext without launching a browser. Reuse existing authentication conventions and keep anonymous, invalid, and foreign-role clients independent of inherited credentials.
3. Assert documented status, headers, required fields/types, and meaningful business values. Use the schema dialect and additional-properties policy in the contract. Do not reject extra fields unless prohibited. A shared schema does not replace independently sourced expected business values.
4. Cover documented success, invalid input, boundary, and permission paths. Test pagination, idempotency, webhooks, GraphQL, and auth lifecycle only when the service supports them. Verify intermediate and persisted effects through independent reads or events, including absence of unauthorized mutations.
5. Own each test's mutable data. Prefer test-scoped fixtures and parallel namespaces over serial tests sharing IDs. Register cleanup before assertions, handle possible side effects after failed creates, and verify teardown. Keep expected arithmetic independent of the service implementation.
6. Use documented latency and payload budgets when supplied; do not impose example thresholds. Keep the API and its owned database real for integration tests; virtualize genuine third parties according to the environment design.
7. Run the scoped tests in the authorized test environment. Record commands, target/version, results, skipped checks, and missing coverage. Exercise healthy and deliberately broken controls in a disposable environment when available; report detection separately from a green run.

## Stable state, cleanup and coverage invariants

Validate raw schema/additional-property policy separately from all documented stable business fields; keep independent values, permissions and state-effect assertions. Register owned resources before requests, attempt every applicable cleanup operation and dispose every owned context, retaining primary and teardown failures.

When implementing state or coverage helpers, read [state and clause-mapping examples](references/response-state-cleanup.md). When implementing cleanup, use the [tested cleanup recipe](references/test-data-cleanup.md) or the existing project fixture. Update existing coverage records; use a separate mapping only when useful or required by the project. Keep unassigned clauses uncovered and implementation separate from execution; supplemental probes never acquire invented approved case IDs.

## References

Examples are templates: replace endpoints, statuses, payloads, schema policy, credentials, and timing with project evidence. Do not install new libraries just because an example uses them.

- [Playwright setup](references/playwright-setup.md): standalone request tests and authenticated API fixtures.
- [Schema validation](references/schema-validation.md): raw schema policy versus independent business expectations; preserve installed validators and dialects.
- [Test patterns](references/test-patterns.md): short owned lifecycle/boundary examples and contract-dependent capability checks.

## Output

Executable tests, case-to-assertion mapping, setup/cleanup, execution evidence, and blocked or uncovered requirements. Report authored and executed tests separately. Test commands run in the automation project, which supplies dependencies and API access.

When organizing or extending suites, read [readable JavaScript patterns](references/maintainable-javascript.md). Keep requests and business assertions visible, reuse small meaningful fixtures/helpers, and use normal multi-line formatting. Preserve the target language/module system; do not migrate to TypeScript or add generic wrappers.

Read [HTTP contracts](references/http-contracts.md) when handling bodyless responses, redirects or cookie authentication. Keep existing schema libraries and contract-derived expectations; do not weaken product-failure assertions.

For JavaScript changes, follow the [shared coding standard](references/javascript.md). Load [selected naming/module/async/error patterns](references/modern-javascript.md) only when those choices matter. Keep business actions and independent expectations visible; reuse the existing fixture/data example.

## Execution

Use the consuming project's package scripts and Playwright configuration directly. Check prerequisites and environment-variable names before execution. Read [execution notes](references/tools-integration.md) only when needed; no repository runner or registry is required.
