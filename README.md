# Microservice QA skills

The active AI setup is [AGENTS.md](AGENTS.md) and [nine skills](.agents/skills/INDEX.md). Choose one primary skill and load only its relevant resources. Copy the relevant skill folders into a consuming project's .agents/skills/; keep that project's contracts, fixtures and optional project notes there. Some supporting references link to other skills: copy those linked resources too when needed.

The [Orders example](.agents/skills/qa-playwright-api-authoring/examples/orders/README.md) preserves runnable JavaScript request tests, isolated fixtures, cleanup and synthetic contracts. It is not a work-service test suite.

```sh
npm ci --ignore-scripts
npm run quality
npm run test:api
```

For actual QA, use the consuming project's commands, authentication and agreed requirements. Offline Zephyr normalization needs Python 3; other workflows use the consuming project's existing tools. No runner, installer, registry, context generator or evaluation system is needed.

Local archives under local-archive/, dependencies, reports, authentication caches and private environment files are ignored. Historical evaluation tooling is outside the active setup.
