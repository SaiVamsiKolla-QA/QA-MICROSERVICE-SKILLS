# Request-only JavaScript setup

Preserve the target package manager, module system, configuration and auth/data fixtures. This ESM configuration is illustrative; the supplied lab already has its own config.

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/api',
  use: {
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: { Accept: 'application/json' },
  },
});
```

Validate required environment-variable names before requests. Do not invent a login endpoint or accept a truthy status range as proof of authentication. Assert the contract's exact login response and authenticated effects when login exists.

For one principal, use the built-in request fixture if inherited headers/storageState are appropriate. Multiple principals need independent APIRequestContexts; anonymous clients must not inherit authorization or cookies. No browser is required.

The [maintained fixture](../../qa-playwright-api-authoring/examples/orders/fixtures.mjs) shows protected partial setup, early resource reservation, all-operation cleanup and disposal. Its bearer principals are synthetic lab values, not consumer defaults. Read [state/cleanup details](response-state-cleanup.md) when implementing that responsibility. Client disposal does not delete backend resources.

Locally revised from the upstream setup reference recorded in ../SOURCE.json; removed TypeScript-only syntax and invented Users/login behavior. Preserve TypeScript in consumers that already use it.
