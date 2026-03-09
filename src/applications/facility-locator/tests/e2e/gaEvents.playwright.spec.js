const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const mockFacilitiesSearchResultsV1 = require('../../constants/mock-facility-data-v1.json');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const mockServices = require('../../constants/mock-provider-services.json');
const {
  jsonResponse,
  featureCombinationsTogglesToTest,
  enabledFeatures,
  assertDataLayerEvent,
  assertDataLayerLastItems,
  assertEventAndAttributes,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const featuresToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featuresToTest) {
  test.describe(
    `Google Analytics FL Events ${enabledFeatures(featureSet)}`,
    () => {
      test.beforeEach(async ({ page }) => {
        await h.setupMapboxStubs(page);
        await page.route('**/v0/feature_toggles*', route =>
          route.fulfill(
            jsonResponse({
              data: { type: 'feature_toggles', features: featureSet },
            }),
          ),
        );
      });

      test('search, pan map, click marker, zoom in/out and verify ga events', async ({
        page,
      }) => {
        await page.route(/maintenance_windows/, route =>
          route.fulfill(jsonResponse([])),
        );
        await page.route(
          new RegExp('facilities_api/v2/ccp/specialties'),
          route => route.fulfill(jsonResponse(mockServices)),
        );
        await page.route(new RegExp('geocoding/'), route =>
          route.fulfill(jsonResponse(mockGeocodingData)),
        );
        await page.route(new RegExp('facilities_api/v2/va'), async route => {
          if (route.request().method() === 'POST') {
            await route.fulfill(jsonResponse(mockFacilitiesSearchResultsV1));
          } else {
            await route.continue();
          }
        });

        await page.goto(h.ROOT_URL);

        // Search
        await h.typeInCityStateInput(page, 'Austin, TX');
        await h.selectFacilityTypeInDropdown(page, 'VA health');
        await page.locator(h.SEARCH_BUTTON).click();

        expect(await axeCheck(page)).toHaveLength(0);

        await expect(page.locator(h.MAP_CONTAINER)).toBeVisible({
          timeout: 10000,
        });

        // Verify fl-search event
        await expect(async () => {
          const win = await page.evaluateHandle(() => window);
          const dl = await page.evaluate(() => window.dataLayer);
          const found = dl.find(d => d.event === 'fl-search');
          expect(found).toBeTruthy();
          await win.dispose();
        }).toPass({ timeout: 10000 });

        // Click map pin (button markers are in the map but not visible due to WebGL stub)
        await page.evaluate(() => {
          const pin = document.querySelector('button.i-pin-card-map');
          if (pin) pin.click();
        });

        await expect(async () => {
          const dl = await page.evaluate(() => window.dataLayer);
          const found = dl.find(d =>
            Object.values(d).includes('fl-map-pin-click'),
          );
          expect(found).toBeTruthy();
          const expectedAttrs = [
            'event',
            'fl-facility-type',
            'fl-facility-id',
            'fl-facility-classification',
            'fl-facility-name',
            'fl-facility-distance-from-search',
          ];
          expectedAttrs.forEach(a => {
            expect(Object.keys(found)).toContain(a);
          });
        }).toPass({ timeout: 10000 });

        // Zoom in 5 times
        // eslint-disable-next-line no-await-in-loop
        for (let i = 0; i < 5; i++) {
          await page.locator('.mapboxgl-ctrl-zoom-in').click({ force: true }); // eslint-disable-line no-await-in-loop
          await page.waitForTimeout(200); // eslint-disable-line no-await-in-loop
        }

        await expect(page.locator(h.MAP_CONTAINER)).toBeVisible();

        await expect(async () => {
          const dl = await page.evaluate(() => window.dataLayer);
          assertDataLayerEvent({ dataLayer: dl }, 'fl-map-zoom-in');
        }).toPass({ timeout: 10000 });

        // Zoom out
        await page.locator('.mapboxgl-ctrl-zoom-out').click({ force: true });
        await page.waitForTimeout(200);

        await expect(async () => {
          const dl = await page.evaluate(() => window.dataLayer);
          assertDataLayerEvent({ dataLayer: dl }, 'fl-map-zoom-out');
        }).toPass({ timeout: 10000 });

        // Pan map (simulating swipe)
        await page.locator(h.MAP_CONTAINER).click();
        const canvas = page.locator('canvas');
        const box = await canvas.boundingBox();
        await page.mouse.move(box.x + 310, box.y + 300);
        await page.mouse.down();
        for (let y = 300; y <= 380; y += 20) {
          await page.mouse.move(box.x + 50, box.y + y); // eslint-disable-line no-await-in-loop
        }
        await page.mouse.up();

        await page.locator(h.MAP_CONTAINER).click();

        await expect(async () => {
          const dl = await page.evaluate(() => window.dataLayer);
          assertDataLayerLastItems(
            { dataLayer: dl },
            ['event', 'fl-map-miles-moved'],
            'fl-search',
          );
        }).toPass({ timeout: 10000 });

        // Click a search result link
        await page
          .getByRole('link', { name: /austin va clinic/i })
          .first()
          .click();

        await expect(async () => {
          const dl = await page.evaluate(() => window.dataLayer);
          assertEventAndAttributes({ dataLayer: dl }, 'fl-results-click', [
            'fl-facility-name',
            'fl-facility-type',
            'fl-facility-classification',
            'fl-facility-id',
            'fl-result-page-number',
            'fl-result-position',
          ]);
        }).toPass({ timeout: 10000 });
      });
    },
  );
}
