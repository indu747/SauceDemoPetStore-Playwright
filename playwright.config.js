// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  // Limit the number of workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {name: 'setup', testMatch:/.*\.setup\.js/ },
    {
      name: 'E2E Chromium',
      testMatch: /.*e2e.spec.js/,
      use: { ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      fullyParallel: true,
      dependencies:['setup']
    },
    {
      name: 'Mobile E2E Chromium',
      testMatch: /.*e2e.spec.js/,
      use: { ...devices['Pixel 5'],
        storageState: 'playwright/.auth/user.json',
      },
      fullyParallel: true,
      dependencies:['setup']
    },

    {
      name: 'E2E Firefox',
      testMatch: /.*e2e.spec.js/,
      use: { ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
       },
       fullyParallel: true,
       dependencies:['setup']
    },

    {
      name: 'E2E Webkit',
      testMatch: /.*e2e.spec.js/,
      use: { ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/user.json',
       },
       fullyParallel: true,
       dependencies:['setup']
    },
    {
      name: 'Mobile E2E Webkit',
      testMatch: /.*e2e.spec.js/,
      use: { ...devices['iPhone 15 Plus'],
        storageState: 'playwright/.auth/user.json',
       },
       fullyParallel: true,
       dependencies:['setup']
    },
    {
      name: 'API Chromium',
      testMatch: /.*api.spec.js/,
      use: { ...devices['Desktop Chrome'],
      },
      fullyParallel: false,
     
    },

    {
      name: 'API Firefox',
      testMatch: /.*api.spec.js/,
      use: { ...devices['Desktop Firefox'],
       },
       fullyParallel: false,
    },

    {
      name: 'API Webkit',
      testMatch: /.*api.spec.js/,
      use: { ...devices['Desktop Safari'],
       },
       fullyParallel: false
    },
  ],
});

