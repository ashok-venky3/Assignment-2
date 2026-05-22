import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
    testDir: './tests/playwright',
    timeout: 30 * 1000,
    expect: { timeout: 5000 },
    reporter: [['list']],
    use: {
        actionTimeout: 0,
        trace: 'on-first-retry',
        baseURL: 'http://localhost:3000'
    },
    webServer: {
        command: 'npm run start:playwright',
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 30 * 1000
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
    ]
});
