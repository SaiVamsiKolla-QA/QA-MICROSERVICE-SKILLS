# Portable installation and updates
Requires Node.js 22+ to run the installer. Python 3 is required only for the case-normalization script. Installing skill files does not install Playwright or modify the target project's dependencies/config.

```sh
node scripts/install.mjs --project /absolute/path/to/automation --profile api --dry-run
node scripts/install.mjs --project /absolute/path/to/automation --profile api
# Selected subset instead of a profile:
node scripts/install.mjs --project /absolute/path/to/automation --skills qa-zephyr-case-review,qa-api-failure-triage
```

`api` selects the five qa-* skills. `browser` selects the same five plus official playwright-cli; selecting only `playwright-cli` installs just browser support. Unknown names/options fail. Unselected installed skills are preserved, including skills installed by other tools. No automatic pruning/uninstall occurs.

The consumer `.agents/skills/.qa-skills-manifest.json` records version and SHA-256 of every installed file. A later invocation updates selected skills only when the current file inventory exactly matches the manifest. Added, deleted and modified files all block replacement. Unmanaged destination folders block installation. Resolve local changes by backing them up outside the skill folder and comparing/merging them with the canonical source, then explicitly move the local folder aside before reinstalling. There is no force switch; do not delete the manifest to bypass conflicts. The manifest is a local integrity baseline, not a signature.

The installer stages copies and keeps rollback backups for ordinary exceptions. A lock serializes cooperating installers, and state is rechecked after locking. Symlinks under the resolved consumer root are refused. The supplied project root is canonicalized, allowing macOS /tmp and /var aliases. Do not edit the target while an install is running. Abrupt process termination/power loss is not a fully transactional filesystem operation: preserve `.qa-stage-*` backups, inspect manifest and installed folders, and restore matching state before retrying. Remove a stale `.qa-skills-install.lock` only after confirming no installer is running.

Optionally copy the context template without overwriting an existing one:
```sh
node -e 'const f=require("node:fs"); f.mkdirSync(process.argv[1]+"/.agents",{recursive:true}); f.copyFileSync("templates/qa-project-context.md",process.argv[1]+"/.agents/qa-project-context.md",f.constants.COPYFILE_EXCL)' /absolute/path/to/automation
```
Fill unknowns from the existing repo. Keep actual exports/results and secrets in the work project under its data policy, never in this reusable skill repository.

## Verify discovery
List `.agents/skills/<name>/SKILL.md` in the target and inspect the install manifest. Start a fresh Codex session in that project and ask it to list available QA skills. Invoke `$qa-zephyr-case-review` with a real export path. If a host does not discover it, explicitly supply the installed SKILL.md path; consult that host's discovery configuration. File validation confirms packaging, not actual host selection. No real work-machine host session was tested here.

## Portability evidence
`npm test` installs into temporary consumer projects, runs the installed normalizer from the consumer working directory using a copied export, checks reference resolution and confirms no cache paths occur in the entrypoint. Every required script/reference is copied. Nothing in the installed package imports the original checkout. This tests file independence; cross-OS host discovery and browser runtime execution remain unverified.
