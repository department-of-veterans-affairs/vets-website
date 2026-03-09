const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const searchData = require('./limited-service-hours-display/mock/search.limited.services.mocks.json');
const h = require('./helpers/playwright-helpers');
const { jsonResponse } = require('./helpers/playwright-mocks');

test.describe('Facility VA search - limited service hours', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    );
    await page.route('**/v0/maintenance_windows', route =>
      route.fulfill(jsonResponse([])),
    );
    await page.route('**/facilities_api/v2/va*', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill(jsonResponse(searchData));
      } else {
        await route.continue();
      }
    });
  });

  test('does a simple search and finds limited service message', async ({
    page,
  }) => {
    await page.goto('/find-locations');

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toHaveLength(0);

    await page.locator('#street-city-state-zip').fill('30310');
    await h.vaSelectSelect(page, '#facility-type-dropdown', 'Vet Centers');
    await page.locator('#facility-search').click();

    await expect(page.locator('#search-results-subheader')).toContainText(
      'near "Atlanta, Georgia 30310"',
      { timeout: 10000 },
    );

    await expect(page.locator('[data-testid="limited-message"]')).toBeVisible();
  });
});
