# Publish privately and use on a work machine
No remote is configured. These commands are for you to run; replace YOUR_GITHUB_ACCOUNT and project paths. They create a private repository and push the local commits:
```sh
cd /Users/vamsikolla/Desktop/kdemo/qa-microservice-skills
gh auth login
gh repo create YOUR_GITHUB_ACCOUNT/qa-microservice-skills --private --source=. --remote=origin --push
```
On your work machine:
```sh
git clone https://github.com/YOUR_GITHUB_ACCOUNT/qa-microservice-skills.git
cd qa-microservice-skills
npm ci
npm test
npm run validate
node scripts/install.mjs --project /absolute/path/to/your-automation --profile api --dry-run
node scripts/install.mjs --project /absolute/path/to/your-automation --profile api
```
Start a new agent session in your automation project, list available QA skills, then invoke `$qa-zephyr-case-review` with your export and contract paths. The work project already supplies its Playwright dependencies; sample dependencies here are only for local verification.

For later updates: pull this skill repository, rerun validation and the installer. If it reports local modifications, preserve and reconcile them as described in INSTALLATION.md. Install browser support only if needed. No company exports or credentials belong in this reusable repository.
