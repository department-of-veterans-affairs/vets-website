const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const mockFacilityDataV1 = require('../../constants/mock-facility-v1.json');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const { jsonResponse } = require('./helpers/playwright-mocks');
const { setupMapboxStubs } = require('./helpers/playwright-helpers');

test.describe('Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupMapboxStubs(page);
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({ data: { type: 'feature_toggles', features: [] } }),
      ),
    );
    await page.route(/maintenance_windows/, route =>
      route.fulfill(jsonResponse([])),
    );
    await page.route(new RegExp('facilities_api/'), route =>
      route.fulfill(jsonResponse(mockFacilityDataV1)),
    );
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mockGeocodingData)),
    );
  });

  test('renders static map images on detail page', async ({ page }) => {
    await page.goto('/find-locations/facility/vha_688GA');

    expect(await axeCheck(page)).toHaveLength(0);

    const img = page.locator('[alt="Static map"]');
    await expect(img).toBeVisible({ timeout: 10000 });

    // Verify the src points to Mapbox static map API
    const src = await img.getAttribute('src');
    expect(src).toContain('api.mapbox.com/styles');
  });
});
