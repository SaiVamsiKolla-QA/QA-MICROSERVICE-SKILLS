# Release experiments, 2026-11-08
Implementation baseline: `0af5d772473110fbebf6928ae63eac5dff8e6baa`. Final documentation commit adds triage prerequisite guidance and reports; runtime/sample tests are unchanged. Node v22.12.0, npm 10.9.0, Playwright Test 1.65.0, macOS ARM64. Dependencies pinned in package-lock.json. Source URLs/SHAs/licenses are in PROVENANCE.md. All examples and credentials are synthetic.

## What was exercised
The author applied each local skill's workflow in this session: normalized/reviewed cases; authored traced API tests; reviewed weak tests; implemented deterministic payloads and per-test resource ownership; investigated captured failures. This is observable in-session work, not a blinded evaluation of skill selection or independent agent performance. There was no comparable with/without-skills agent experiment, and no claim that the skills caused an improvement percentage.

Structural checks and semantic observations are separate:
- `npm test`: seven tests pass, covering dry run, subset/profile install, updates, local added/edited/deleted files, unmanaged collisions, symlinks, installed script independence and CSV/JSON preservation/rejection controls. Each test includes multiple assertions/inputs; seven is the test count, not the input count.
- `npm run validate`: all six skill packages have valid expected metadata, licenses and resolvable resource links. Link scanning ignores code examples/inline code. Official browser snapshot checksums recorded separately.
- Skill-creator `quick_validate.py`: all six pass. System and bundled Python initially lacked PyYAML, so validation used a disposable /private/tmp/qa-skill-validation-venv with PyYAML 6.0.3. This is a development validation dependency, not an installed skill requirement.
- `npm ci --ignore-scripts --offline`: succeeds from local package cache; audit output reports zero vulnerabilities for this installed dependency set. This is not a security review.
- `npm run test:api -- --grep 'ZEP-2' --workers=1`: one state read-back test passes independently.
- Final `npm run test:api` from committed implementation: seven pass. [Final healthy log](../eval/results/final-healthy.log), [installer/normalizer log](../eval/results/verification.log).

## Fault-control matrix
`npm run evaluate` starts a fresh in-memory loopback service on an allocated port per suite/fault, then runs real Playwright API requests. Four worker processes, fullyParallel, no retries. Healthy suites use three repetitions; faults use one. Exact commands, run IDs, counts and assertion failures are in [matrix.json](../eval/results/matrix.json). Every run also has a raw JSON report, console log and service event/inventory file. JSON report body attachments are base64-encoded and retain request data recipes and observed response payloads.

Development suite:
- Healthy: 21 passed, zero failed, zero remaining resources.
- Content: six passed, one failed; ZEP-1 sees total 251 versus required 250.
- Schema: six passed, one failed; ZEP-1 sees required owner missing.
- Authorization: six passed, one failed; ZEP-3 observes foreign read and delete allowed.
- State: four passed, three failed; ZEP-2 observes POST success followed by GET 404; downstream permission/delete cases also fail from absent setup.
- Every faulty development run leaves zero owned resources, including after failed assertions. These are four manually controlled faults, not an exhaustive mutation score.

Held-apart evaluation files in eval/holdout were not used as examples inside the skills. The same author could inspect them; they are not blinded or independent:
- Healthy: six passed across three repeats.
- Content/schema/state: each yields one pass and one failure.
- Authorization: both pass, a **missed defect** because these two cases have no foreign-principal coverage. The gap is retained rather than silently extending the held-apart suite.

Deliberately weak suite:
- Healthy repeated: four pass, two fail from shared-ID duplicate creates; one leaked resource.
- Content, schema, authorization: two pass in each run, one leaked resource each.
- State: two pass, zero remaining resources because nothing was persisted.
- Thus the weak tests miss all four injected defects. These tests differ by design from the development tests; their results are not a fair no-skill agent baseline.

## Case review and automation evidence
[case-review.json](../eval/results/case-review.json) preserves all ten original records: six Valid/Ready, two Needs update/Blocked (wrong total and missing expected/setup/data), two Needs clarification/Blocked (ambiguous flow/unsupported discount). [holdout-review.json](../eval/results/holdout-review.json) records two valid boundary/duplicate cases and one unresolved tax oracle. Corrections are proposals, never replacements for original content.

[Mapping](../examples/cases/mapping.json) maps six original development IDs to test titles and requirement-derived assertions; ZEP-5 expands into two boundary tests. Holdout titles preserve HOLD-1/HOLD-2 and cite R1/R2 through holdout case records. Blocked cases were not turned into passing/skipped placeholders. The service requirement revision supplies independent expected arithmetic; tests do not import its calculator.

[Weak-test findings](../eval/results/weak-review.md) include exact file/line references and concrete replacements supported by fault and leak evidence. [Triage review](../eval/results/triage-review.md) separates observations from hypotheses and includes reproduction steps. `node scripts/triage-controls.mjs` captures direct reproductions for healthy/four product controls plus a known wrong oracle and real closed-port environment error. The unresolved tax example remains unsupported, not misclassified as a product defect.

## Two improvement iterations
1. Packaging and controls: initial installer tests rejected macOS /var aliases. Canonicalizing the consumer project root fixed that while retaining rejection of symlinks inside it. All seven tests now pass. Initial link validation mistook an upstream inline example image for a packaged resource; exclude code examples instead of altering unchanged upstream material. Initial evaluation assumed every held-apart case detects every fault and stopped on the surviving authorization fault; record that coverage miss and continue. Initial sandbox execution could not bind loopback; authorized local execution succeeded. Apple Git required an unaccepted Xcode agreement; used the available bundled Git without changing system agreements.
2. Failure interpretation: state injection caused several failures including foreign-request 404s. Added a narrow triage rule to verify resource existence/setup before calling such a result an authorization defect. The retained triage analysis identifies one persistence fault with cascading symptoms. No tests or expected values were weakened. Installer ordinary-error rollback and post-lock state checking were also added; abrupt termination remains a documented limitation, not claimed crash-safe behavior.

No third iteration was needed. Runtime code was not changed after the complete matrix; final skill text/package checks were rerun after the triage guidance change.

## Unsupported or unverified
Only documented synthetic JSON/CSV structures were exercised: arrays, testCases envelope, UTF-8/BOM, quoted comma/newline and negative parsing controls. Actual Zephyr-native XLSX/XML, repeated step rows/custom headers and real company exports remain untested. Full source text and original objects remain in normalized outputs. The normalizer refuses existing output paths.

Browser runtime, live Zephyr, OAuth, non-Scale-Cloud editions, work-machine host discovery and cross-OS operation were not exercised. Installed file independence was tested from a temporary consumer, not by launching a real work-machine agent. No CI history, eventual consistency, refresh-token lifecycle, multi-service transactions or distributed cleanup was evaluated. The development suite still lacks upper valid boundaries, invalid price/token/malformed-JSON and duplicate preservation; the holdout adds only minimum boundary/duplicate coverage.

Trace ZIPs are ephemeral under ignored test-results; retained JSON includes observed body attachments, but old trace file paths may no longer resolve. Evaluation reruns overwrite the fixed result filenames; preserve a copy/commit before comparing campaigns. Service diagnostic routes are unauthenticated local test-only helpers and must not be deployed. Installer hash manifests detect ordinary local edits, not malicious manifest tampering or process-kill consistency.
