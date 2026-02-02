import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envFile = path.resolve(__dirname, `.env.${process.env.ENVIRONMENT || 'development'}`);
const defaultFile = path.resolve(__dirname, '.env');

dotenv.config({
  path: fs.existsSync(envFile) ? envFile : defaultFile,
});


export default defineConfig({
  testDir: "./e2e/tests",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL ,
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
