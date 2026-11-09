import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseURL = process.env.API_BASE_URL || 'http://127.0.0.1:33177';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.mjs',
  fullyParallel: true,
  workers: 3,
  retries: 0,
  timeout: 10000,
  reporter: 'list',
  outputDir: '../../../../../test-results/orders',
  use: { baseURL },
  webServer: process.env.API_BASE_URL
    ? undefined
    : {
        cwd: fileURLToPath(new URL('.', import.meta.url)),
        command: 'node server.mjs',
        url: `${baseURL}/health`,
        reuseExistingServer: false,
        timeout: 10000,
        env: { PORT: '33177' },
      },
});
