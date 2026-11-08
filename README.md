# qa-microservice-skills
Portable skills for reviewing exported Zephyr cases and writing, reviewing and investigating Playwright API tests. Five API skills plus optional official browser CLI support. No live Zephyr account or browser is needed for the local API demo.

## Setup and install
Requires Git, Node.js 22+, npm, and Python 3 for normalization.
```sh
npm ci
npm test
npm run validate
npm run test:api
npm run evaluate
node scripts/install.mjs --project /absolute/path/to/your-automation --profile api --dry-run
node scripts/install.mjs --project /absolute/path/to/your-automation --profile api
```
The installer copies whole folders to the consumer `.agents/skills/`, writes an integrity manifest, and blocks local-modification conflicts. It does not install dependencies into your automation project. See [installation and updates](docs/INSTALLATION.md) for selected skills, context template and discovery checks.

## Everyday use
Start a fresh agent session in the consumer project. Supply actual paths and contracts:
- `$qa-zephyr-case-review Review exports/cases.csv against openapi.yaml and requirements/. Preserve IDs and separate proposed corrections.`
- `$qa-playwright-api-authoring Implement Ready cases from reviews/cases.json using our existing fixtures; map each case and oracle.`
- `$qa-playwright-api-review Review tests/api/ against the mapped requirements; give file/line corrections and detection evidence.`
- `$qa-api-test-data Add deterministic payload factories, run namespaces and failure-safe cleanup for tests/api/.`
- `$qa-api-failure-triage Investigate the failed run in artifacts/ with config and contract evidence; separate observations from hypotheses.`

Normalize a supported export without overwriting it:
```sh
python3 skills/qa-zephyr-case-review/scripts/normalize.py examples/cases/development.csv /tmp/normalized-cases.json
```
Supported formats actually tested: synthetic UTF-8/BOM CSV (quoted commas/newlines), JSON array, and JSON testCases envelope. Native XLSX/XML, custom columns and repeated step rows require an adapter. Original content is retained. See [formats](skills/qa-zephyr-case-review/references/exports.md).

## Evidence and limits
The sample uses a synthetic Orders API with four switchable faults. Healthy development tests pass 21 repeated/parallel executions; the development suite detects content/schema/authorization/state faults. The separate holdout suite misses authorization. Weak tests miss all four and leak resources. These are local test-control results plus in-session skill applications, not independent agent success rates or a measured with/without-skills improvement. [Experiment record](docs/EXPERIMENTS.md), [raw results](eval/results/matrix.json), [cases and mappings](examples/cases/), [requirements](examples/service/requirements.md).

[Optional browser setup](docs/BROWSER.md) • [Optional Zephyr MCP and edition limits](docs/ZEPHYR-MCP.md) • [Provenance/licenses](docs/PROVENANCE.md) • [Private publishing and work-machine clone](docs/PUBLISH.md).

Keep live credentials and company data out of this repository. No remote is created or pushed by the build.
