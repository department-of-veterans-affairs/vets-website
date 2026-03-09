const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const mockFacilitiesSearchResultsV1 = require('../../constants/mock-facility-data-v1.json');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const mockServices = require('../../constants/mock-provider-services.json');
const {
  jsonResponse,
  setupCommonMocks,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

test('handles map zooming correctly', async ({ page }) => {
  await setupCommonMocks(page);
  await page.route('**/facilities_api/v2/ccp/specialties', route =>
    route.fulfill(jsonResponse(mockServices)),
  );
  await page.route('**/geocoding/**', route =>
    route.fulfill(jsonResponse(mockGeocodingData)),
  );
  await page.route('**/facilities_api/v2/**', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill(jsonResponse(mockFacilitiesSearchResultsV1));
    } else {
      await route.continue();
    }
  });

  await page.goto(h.ROOT_URL);

  await h.typeInCityStateInput(page, 'Austin, TX');
  await h.selectFacilityTypeInDropdown(page, 'VA health');
  await page.locator(h.SEARCH_BUTTON).click({ force: true });

  await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
    /(Showing|Results).*VA health.*All VA health services.*near.*Austin, Texas/i,
  );

  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toHaveLength(0);

  // Zoom in 15 times
  for (let i = 0; i < 15; i++) {
    await page.locator('.mapboxgl-ctrl-zoom-in').click(); // eslint-disable-line no-await-in-loop
    await page.waitForTimeout(100); // eslint-disable-line no-await-in-loop
  }

  await expect(page.locator('#search-area-control')).toContainText(
    'Search this area of the map',
  );

  // Zoom out 13 times
  for (let i = 0; i < 13; i++) {
    await page.locator('.mapboxgl-ctrl-zoom-out').click(); // eslint-disable-line no-await-in-loop
    await page.waitForTimeout(100); // eslint-disable-line no-await-in-loop
  }

  await expect(page.locator('#search-area-control')).toContainText(
    'Zoom in to search',
  );

  // Zoom in 12 times
  for (let i = 0; i < 12; i++) {
    await page.locator('.mapboxgl-ctrl-zoom-in').click(); // eslint-disable-line no-await-in-loop
    await page.waitForTimeout(100); // eslint-disable-line no-await-in-loop
  }

  await expect(page.locator('#search-area-control')).toContainText(
    'Search this area of the map',
  );
  await page.locator('#search-area-control').click();

  // Simulate map drag (swipe equivalent)
  const mapCanvas = page.locator('.mapboxgl-canvas');
  const box = await mapCanvas.boundingBox();
  await page.mouse.move(box.x + 310, box.y + 300);
  await page.mouse.down();
  for (let y = 300; y <= 380; y += 20) {
    await page.mouse.move(box.x + 50, box.y + y); // eslint-disable-line no-await-in-loop
  }
  await page.mouse.up();

  await page.locator(h.MAP_CONTAINER).click();

  await expect(page.locator('#search-area-control')).toBeVisible();
  await page.locator('#search-area-control').click();
});
