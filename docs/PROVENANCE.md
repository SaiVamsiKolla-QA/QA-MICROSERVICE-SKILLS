# Sources and adaptation record
Inspected 2026-11-08. Source checkouts were cloned to `/private/tmp/qa-skills-dev-cache`, outside discovery paths. This cache is disposable and is never needed by installed skills. Exact repository commits and URLs: [upstream.json](../third_party/upstream.json). Source licenses are retained in [third_party](../third_party/) and inside distributed skills. Original work is MIT; the browser package remains Apache-2.0.

## Selection decisions
- `test-case-management`: selected anatomy, deterministic expectations, requirement traceability and automation readiness for qa-zephyr-case-review. Excluded other test-management products and live-write recipes.
- `api-testing`: selected APIRequestContext, response contracts, permissions and state checks for qa-playwright-api-authoring. Excluded alternative clients, generic performance thresholds, GraphQL and browser setup. Replaced serial shared-resource lifecycle with independent fixtures. Added independently grounded oracles; additional fields follow the contract rather than unconditional exact keys.
- `test-data-management`: selected ownership, deterministic factories, namespaces and failure-safe teardown for qa-api-test-data. Excluded unrelated language stacks and production data copying.
- `ai-qa-review`: selected assertion quality, diagnostic value and defect-detection evidence for qa-playwright-api-review. Excluded automatic mutation-score gates without measured mutations.
- `test-suite-curation`: evaluated; selected only the principle that equal execution coverage does not establish redundancy, in the review skill. Full pruning/tiering skill omitted from this focused release.
- `ai-bug-triage`: selected evidence-first classification and useful report fields for qa-api-failure-triage. Omitted clustering pipelines, automatic routing/ticket writes and numerical accuracy thresholds unsupported by local evidence.
- `qa-project-context`: selected evidence-based discovery and explicit unknowns for the project-context template. No extra context skill installed; each skill works without a filled template.
- `hzijad/playwright-agent-skills`: inspected README, core and debugging skills. Selected concepts of independent state, readable tests, known-broken controls and repeated execution for authoring/review/triage. Did not copy browser locator rules, UI-specific auth state or network mocks into the API profile. All four upstream skills omitted as separately discoverable skills to avoid overlapping triggers.
- `microsoft/playwright-cli`: selected official `skills/playwright-cli` directory **unchanged**, including every reference. Added only its root LICENSE. Browser profile only. See [browser setup](BROWSER.md).
- `SmartBear/smartbear-mcp`: README and `src/zephyr/client.ts` inspected to verify Scale Cloud v2 compatibility. No MCP code shipped or connected. License preserved as source-inspection record.

## Unchanged versus adapted
[third_party/qa-skills](../third_party/qa-skills/) holds unchanged entrypoint text snapshots with `.upstream.md` names, for auditing only, not runnable/discoverable packages. They refer to upstream resources intentionally not vendored because their full workflows were not selected. Adapted skills are newly organized workflows under `skills/qa-*`; their required resources were authored here. No links from adapted skills require the cache or those snapshots.

The official browser entrypoint and references match the upstream SHA-256 inventory in [browser-files.json](../third_party/browser-files.json). Skill-local notices identify sources even after installation. No upstream AGENTS.md was copied into the consumer project.

## Documentation verified
- [Playwright API testing](https://playwright.dev/docs/api-testing): request fixture/context and setup/teardown, no page required.
- [Official CLI installation](https://github.com/microsoft/playwright-cli#installation): `npm install -g @playwright/cli@latest`, `playwright-cli --help`, optional upstream `playwright-cli install --skills`. Our installer already supplies its pinned skill snapshot; running the upstream installer again can overwrite it.
- [Official Codex installation paths](https://developers.openai.com/api/reference/cli): Codex project scope `.agents/skills/`, whole skill folder copied, start a new agent session. [Build skills](https://learn.chatgpt.com/docs/build-skills) also checked.
- [SmartBear source](https://github.com/SmartBear/smartbear-mcp/blob/27ce458080579b7e2cb60d0e81995ab0f0c85c5f/src/zephyr/client.ts) and README: Scale token and v2 endpoint. Developer integration page was login-gated in retrieval; edition guidance relies on actual source, not that inaccessible page.
