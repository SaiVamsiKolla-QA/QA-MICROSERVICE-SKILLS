# Execution notes

Inspect package.json, the lockfile, Playwright configuration and existing fixtures. Run the project's documented command; for Playwright, use its existing request-test config and a scoped test path. API-only tests need no browser installation. Keep credentials external. Record the command, environment and actual passed/failed/skipped results; report missing prerequisites rather than inventing success.

Read only the relevant recipe:

- [reporting triage](reporting-triage.md)
- [api auth assertions](api-auth-assertions.md)
- [schema validation](schema-validation.md)
