import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./examples/tests',fullyParallel:true,workers:4,retries:0,timeout:10000,
  reporter:[['list'],['json',{outputFile:process.env.REPORT_FILE??'test-results/results.json'}]],
  use:{baseURL:process.env.API_BASE_URL??'http://127.0.0.1:3100',trace:'retain-on-failure'},
  webServer:process.env.API_BASE_URL?undefined:{command:'node examples/service/server.mjs',url:'http://127.0.0.1:3100/health',reuseExistingServer:false}});
