const { test, expect } = require('@playwright/test');

test('Renders the homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});
