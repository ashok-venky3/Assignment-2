import { test, expect } from '@playwright/test';

test('homepage loads and API responds', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Playwright Server Demo');

  const response = await request.get('/api/echo');
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.message).toBe('Playwright server is ready');
});
