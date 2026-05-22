import { test, expect } from '@playwright/test';

test('MCP health and context endpoints work', async ({ request }) => {
  const health = await request.get('http://127.0.0.1:4000/health');
  expect(health.ok()).toBeTruthy();

  const healthBody = await health.json();
  expect(healthBody.status).toBe('ok');

  const payload = {
    userId: 'user-123',
    sessionId: 'session-abc',
    data: { feature: 'test-client' }
  };

  const response = await request.post('http://127.0.0.1:4000/context', {
    data: payload,
    headers: { 'Content-Type': 'application/json' }
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.message).toBe('MCP context accepted');
  expect(body.received).toEqual(payload);
});
