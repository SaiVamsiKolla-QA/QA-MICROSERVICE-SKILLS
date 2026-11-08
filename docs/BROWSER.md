# Optional browser profile
The official Microsoft Playwright CLI skill is vendored unchanged, with its references and Apache-2.0 license. It is separate from APIRequestContext tests. Canonical snapshot and SHA are in third_party/upstream.json; the installed skill is named `playwright-cli`.

```sh
node scripts/install.mjs --project /absolute/path/to/automation --profile browser
# Or add only browser support:
node scripts/install.mjs --project /absolute/path/to/automation --skills playwright-cli
```

The official upstream README requires Node.js 18+ (this repository's scripts require 22+) and documents:
```sh
npm install -g @playwright/cli@latest
playwright-cli --help
```
Upstream also offers `playwright-cli install --skills`; avoid duplicating that step after our installer, since it can replace our manifest-tracked snapshot. `latest` deliberately follows the official runtime setup, so record the resolved version and review compatibility with the pinned skill snapshot. The inspected source manifest was 0.1.23 and referenced an alpha Playwright dependency; it is not a claim that 0.1.23 is the current npm release.

Use an installed Chrome/channel or install the browser required by your selected runtime following its help. Browser binaries, OS dependencies and network access are additional prerequisites; they are not installed by this repository. API-only examples need no browser download. The upstream skill also describes `npx playwright cli` when the local runtime supports it; confirm with that project's installed version rather than assuming older versions support the command.

Invoke `$playwright-cli` with an authorized URL and browser task. Keep session/storage-state/trace files out of Git; auth state can contain credentials. Browser runtime and UI behavior were not exercised in this release. Only package/reference integrity and consumer installation were verified.
