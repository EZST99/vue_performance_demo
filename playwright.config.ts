import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    headless: false, // WICHTIG
    baseURL: 'http://localhost:5173',
  },

  projects: [
    {
      name: 'chromium',
    },
  ],
});