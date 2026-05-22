import { test, expect } from '@playwright/test';

test('end-to-end home page and Excel create flow', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Playwright Server Demo');

  const payload = {
    sheets: [
      {
        name: 'Summary',
        data: [
          ['Name', 'Value'],
          ['Test', 'OK'],
          ['Count', 42]
        ]
      }
    ]
  };

  const response = await request.post('http://127.0.0.1:4000/excel/create', {
    data: payload,
    headers: { 'Content-Type': 'application/json' }
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.message).toBe('excel created');
  expect(body.sheetNames).toEqual(['Summary']);
  expect(typeof body.workbookBase64).toBe('string');
  expect(body.workbookBase64.length).toBeGreaterThan(0);
});
