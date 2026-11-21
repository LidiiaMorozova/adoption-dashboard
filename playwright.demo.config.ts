import {defineConfig, devices} from '@playwright/test';

const isCI = Boolean(process.env.CI);
const DEMO_URL = 'http://localhost:4173/adoption-dashboard/';

/** End-to-end tests of the static GitHub Pages demo, which runs without the API. */
export default defineConfig({
  testDir: './e2e-demo',
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', {open: 'never', outputFolder: 'playwright-report-demo'}]] : 'list',
  use: {
    baseURL: DEMO_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'mobile', use: {...devices['Pixel 7']}},
  ],
  webServer: {
    command: 'npm run build:demo && npm run preview:demo -- --strictPort',
    url: DEMO_URL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
