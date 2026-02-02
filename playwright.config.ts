import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: 0,
  reporter: [['html', { open: 'never' }]],

  use: {
    storageState: 'storageState.json',
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    headless: false, // mettre true si tu veux en mode headless
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
   // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
   // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
