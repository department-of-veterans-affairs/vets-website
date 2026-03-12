const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const searchData = require('./limited-service-hours-display/mock/search.limited.services.mocks.json');
const h = require('./helpers/playwright-helpers');
const { jsonResponse } = require('./helpers/playwright-mocks');

test.describe('Facility VA search - limited service hours', () => {
  test.beforeEach(async ({ page }) => {
    await h.setupMapboxStubs(page);
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    );
    await page.route(/maintenance_windows/, route =>
      route.fulfill(jsonResponse([])),
    );
    await page.route(new RegExp('facilities_api/v2/va'), async route => {
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

    expect(await axeCheck(page)).toHaveLength(0);

    await page.locator('#street-city-state-zip').fill('30310');
    await h.selectFacilityTypeInDropdown(page, 'Vet Centers');
    await page.locator('#facility-search').click();

    await expect(page.locator('#search-results-subheader')).toContainText(
      'near "Austin, Texas"',
      { timeout: 10000 },
    );

    await expect(page.locator('[data-testid="limited-message"]')).toBeVisible();
  });
});
