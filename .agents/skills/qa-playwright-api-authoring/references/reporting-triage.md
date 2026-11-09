# Execution and failure investigation

Run the target project's documented command against its configured local or QA environment. Preserve the original failure before retrying. Record command, target/version, requirement/case ID, principal role, safe request/response and correlation ID. Redact credentials and sensitive data.

Classify as product only when valid input violates documented behavior; automation when the oracle/setup/client is demonstrably wrong; environment when routing/configuration/dependency evidence explains it. Keep competing explanations unresolved and state the next useful check.

Read actual assertions and fresh reporter output. Separate authored, executed and observed results; report failed, skipped, blocked and unrun checks. A zero exit code or an old report alone does not establish coverage. Draft defects locally; external ticket or Zephyr writes require authorization.
