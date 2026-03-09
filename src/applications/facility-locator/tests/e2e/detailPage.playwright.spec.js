const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const mockFacilityDataV1 = require('../../constants/mock-facility-v1.json');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const { jsonResponse } = require('./helpers/playwright-mocks');

test.describe('Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    );
    await page.route('**/v0/maintenance_windows', route =>
      route.fulfill(jsonResponse([])),
    );
    await page.route('**/facilities_api/**', route =>
      route.fulfill(jsonResponse(mockFacilityDataV1)),
    );
    await page.route('**/geocoding/**', route =>
      route.fulfill(jsonResponse(mockGeocodingData)),
    );
  });

  test('renders static map images on detail page', async ({ page }) => {
    await page.goto('/find-locations/facility/vha_688GA');

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toHaveLength(0);

    const img = page.locator('[alt="Static map"]');
    await expect(img).toBeVisible({ timeout: 10000 });

    const naturalWidth = await img.evaluate(el => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});
