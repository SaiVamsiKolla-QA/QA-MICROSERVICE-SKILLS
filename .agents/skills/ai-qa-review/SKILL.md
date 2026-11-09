---
name: ai-qa-review
description: Review existing microservice test code for assertion quality, reliability, diagnostic value, testability, and coverage gaps. Use for broad test-quality audits; use qa-playwright-api-review for detailed Playwright API and Zephyr traceability reviews.
---

# Review existing automation

Read the project's AGENTS.md, optional `.agents/qa-project-context.md`, test configuration, fixtures, requirements, and API contracts. Infer existing conventions before asking questions. Limit review to the requested files or suite; reviewing does not authorize broad rewrites or new CI gates.

## Workflow

1. Identify the review scope and map tests to documented behavior and approved Zephyr cases where available. Distinguish missing requirements from missing tests.
2. Inspect assertions for exact business values, required shape/types, status, headers, permission boundaries, and observable state effects. Coverage only shows execution; a passing test alone does not establish defect detection.
3. Check shared mutable data, order dependence, auth leakage, swallowed cleanup errors, retries, arbitrary sleeps, and failure messages. Keep the API under test real; virtualize genuine third-party dependencies only where appropriate to the test scope.
4. Review duplication by inputs, oracle, and detection behavior. Similar assertions or common endpoints alone do not establish redundancy. Check data-driven tests follow the project's Playwright conventions rather than imposing Jest-only APIs.
5. For application testability, inspect dependency injection, side-effect isolation, independently testable business rules, and narrow interfaces. Suggest changes only when supported by an observed problem.
6. Run the scoped suite when the environment and dependencies are available. Preserve red, skipped, blocked, and unrun results. Use repeated or parallel runs to investigate suspected instability; a static review remains useful when execution is unavailable.
7. Use mutation testing or controlled faults when available and relevant. Establish a healthy baseline first, verify the altered behavior was exercised, and report detected and missed faults. Do not invent a score or require a generic percentage gate.

## References

Read only the reference needed for a finding:

- [Smell examples](references/smell-examples.md): assertion, isolation, fixture, and coverage corrections; adapt examples to the project's API runner.
- [Testability refactors](references/testability-refactors.md): dependency injection and side-effect separation.
- [Mutation testing](references/mutation-testing.md): optional detection checks when source instrumentation is available.

## Output

Prioritized findings with severity, file/line, evidence, escaping defect, and concrete correction. Include coverage gaps, commands and observed results, and execution limits. Report no findings when appropriate; static findings and demonstrated runtime failures are separate claims.

For changed JavaScript, use the [shared coding standard](references/javascript.md) and, when simplification is relevant, the [changed-code checklist](references/changed-code-review.md). Ask whether another QA can understand, diagnose and extend the change using existing examples. Keep review on changed code unless broader scope was requested; style preferences alone are not defects.

## Execution

Use the consuming project's package scripts and Playwright configuration directly. Check prerequisites and environment-variable names before execution. Read [execution notes](references/tools-integration.md) only when needed; no repository runner or registry is required.
