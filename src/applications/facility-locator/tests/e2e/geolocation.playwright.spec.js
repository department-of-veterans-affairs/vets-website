const { test, expect } = require('@playwright/test');
const mockLaLocation = require('../../constants/mock-la-location.json');
const {
  jsonResponse,
  featureCombinationsTogglesToTest,
  enabledFeatures,
} = require('./helpers/playwright-mocks');
const { setupMapboxStubs } = require('./helpers/playwright-helpers');

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featureSetsToTest) {
  test.describe(`Facility geolocation ${enabledFeatures(featureSet)}`, () => {
    const useMyLocationLink = '.use-my-location-link';
    const locationInputField =
      '.street-city-state-zip-autosuggest-label-container';

    test.beforeEach(async ({ page }) => {
      await setupMapboxStubs(page);
      await page.route('**/v0/feature_toggles*', route =>
        route.fulfill(
          jsonResponse({
            data: { type: 'feature_toggles', features: featureSet },
          }),
        ),
      );
    });

    test('geolocates the user', async ({ page }) => {
      await page.route(new RegExp('geocoding/'), route =>
        route.fulfill(jsonResponse(mockLaLocation)),
      );

      // Stub geolocation before page loads
      await page.addInitScript(() => {
        // eslint-disable-next-line no-undef
        const mockGeolocation = {
          getCurrentPosition: callback => {
            setTimeout(() => {
              callback({
                coords: { latitude: 34.0522, longitude: -118.2437 },
              });
            }, 100);
          },
          watchPosition: () => {},
          clearWatch: () => {},
        };
        Object.defineProperty(navigator, 'geolocation', {
          value: mockGeolocation,
          writable: true,
        });
      });

      await page.goto('/find-locations');

      await expect(page.locator('#street-city-state-zip')).toHaveValue('');

      await page.locator(useMyLocationLink).click();
      await expect(page.locator(locationInputField)).toContainText(
        'Finding your location...',
      );

      // Wait for location to resolve
      await expect(page.locator(locationInputField)).toContainText(
        'Use my location',
        { timeout: 10000 },
      );

      // Small delay for the input value to update
      await page.waitForTimeout(300);

      const val = await page.locator('#street-city-state-zip').inputValue();
      expect(val).toContain('Los Angeles');
    });
  });
}
