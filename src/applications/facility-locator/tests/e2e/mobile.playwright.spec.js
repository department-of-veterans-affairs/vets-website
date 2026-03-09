const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const mockFacilityDataV1 = require('../../constants/mock-facility-data-v1.json');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const {
  jsonResponse,
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const city = 'Austin, TX';
const randomInput = 'Random Input To be Cleared';

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
  'facility_locator_mobile_map_update',
]);

async function checkClearInput(page, clearInputSelector) {
  await page.locator(h.CITY_STATE_ZIP_INPUT).clear();

  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toHaveLength(0);

  for (const char of randomInput) {
    await page.locator(h.CITY_STATE_ZIP_INPUT).press(char); // eslint-disable-line no-await-in-loop
  }
  await page.locator(clearInputSelector).click();
  await expect(page.locator(h.CITY_STATE_ZIP_INPUT)).toHaveValue('');
}

async function checkSearch(page, isMobileMapUpdateEnabled) {
  const axeResults = await new AxeBuilder({ page }).analyze();
  expect(axeResults.violations).toHaveLength(0);

  await page.locator(h.CITY_STATE_ZIP_INPUT).clear({ force: true });
  await page.locator(h.CITY_STATE_ZIP_INPUT).fill(`${city}`);
  await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
  await h.selectFacilityTypeInDropdown(page, 'VA health');
  await page.locator(h.SEARCH_BUTTON).click();

  await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toBeVisible({
    timeout: 10000,
  });

  if (!isMobileMapUpdateEnabled) {
    await expect(page.locator('#react-tabs-0')).toContainText('View List');
    await expect(page.locator('#react-tabs-2')).toContainText('View Map');
  } else {
    await expect(
      page.locator("button.segment[role='tab']").nth(0),
    ).toContainText('View List');
    await expect(
      page.locator("button.segment[role='tab']").nth(1),
    ).toContainText('View Map');
  }

  await expect(page.locator('.facility-result').first()).toBeVisible();

  if (!isMobileMapUpdateEnabled) {
    await page.locator('#react-tabs-2').click();
  } else {
    await page
      .locator("button.segment[role='tab']")
      .nth(1)
      .click();
  }

  await expect(page.locator(h.MAP_CONTAINER)).toBeVisible();
  await expect(page.locator('.i-pin-card-map').first()).toContainText('1');

  if (!isMobileMapUpdateEnabled) {
    await page.locator('#react-tabs-0').click();
  } else {
    await page
      .locator("button.segment[role='tab']")
      .nth(0)
      .click();
  }

  await page.locator(h.CITY_STATE_ZIP_INPUT).clear();
}

for (const featureSet of featureSetsToTest) {
  test.describe(`Mobile ${enabledFeatures(featureSet)}`, () => {
    const clearInputSelector = '#clear-street-city-state-zip';
    const isMobileMapUpdateEnabled = featureSet.some(
      isFeatureEnabled('facility_locator_mobile_map_update'),
    );

    test.beforeEach(async ({ page }) => {
      await page.route('**/v0/feature_toggles*', route =>
        route.fulfill(jsonResponse({ data: { features: featureSet } })),
      );
      await page.route('**/v0/maintenance_windows', route =>
        route.fulfill(jsonResponse([])),
      );
      await page.route('**/facilities_api/**', async route => {
        if (route.request().method() === 'POST') {
          await route.fulfill(jsonResponse(mockFacilityDataV1));
        } else {
          await route.continue();
        }
      });
      await page.route('**/geocoding/**', route =>
        route.fulfill(jsonResponse(mockGeocodingData)),
      );
    });

    test('renders in mobile layouts, clear input and tab/control actions', async ({
      page,
    }) => {
      await page.goto(h.ROOT_URL);

      // iPhone X
      await page.setViewportSize({ width: 400, height: 812 });
      await checkClearInput(page, clearInputSelector);
      await checkSearch(page, isMobileMapUpdateEnabled);

      // iPhone 6/7/8 plus
      await page.setViewportSize({ width: 414, height: 736 });
      await checkClearInput(page, clearInputSelector);
      await checkSearch(page, isMobileMapUpdateEnabled);

      // Pixel 2
      await page.setViewportSize({ width: 411, height: 731 });
      await checkClearInput(page, clearInputSelector);
      await checkSearch(page, isMobileMapUpdateEnabled);

      // Galaxy S5/Moto
      await page.setViewportSize({ width: 360, height: 640 });
      await checkClearInput(page, clearInputSelector);
      await checkSearch(page, isMobileMapUpdateEnabled);
    });

    const isProgDiscEnabled = featureSet.some(
      isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
    );
    const sizes = isProgDiscEnabled
      ? [
          [1024, 1000, 299, 20],
          [1007, 1000, 900, 100],
          [768, 1000, 699, 40],
          [481, 1000, 436, 40],
        ]
      : [
          [1024, 1000, 180.25, 140],
          [1007, 1000, 900, 100],
          [768, 1000, 699, 40],
          [481, 1000, 436, 40],
        ];
    const smDesktopOrGreater = 1024;
    const tabletOrGreater = 768;
    const phoneOrGreater = 320;

    for (const size of sizes) {
      test(`renders in desktop layout at ${size[0]}x${size[1]}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: size[0], height: size[1] });
        await page.goto(h.ROOT_URL);

        const axeResults = await new AxeBuilder({ page }).analyze();
        expect(axeResults.violations).toHaveLength(0);

        const searchButtonBox = await page
          .locator(h.SEARCH_BUTTON)
          .boundingBox();
        expect(searchButtonBox.width).toBeCloseTo(size[2], -1);

        if (size[0] >= smDesktopOrGreater && isProgDiscEnabled) {
          await expect(
            page.locator('#vertical-oriented-left-controls'),
          ).toBeVisible();
          await expect(page.locator('.react-tabs')).toHaveCount(0);
        } else if (size[0] >= tabletOrGreater) {
          await expect(
            page.locator('#vertical-oriented-left-controls'),
          ).toHaveCount(0);
          await expect(
            page.locator('.tablet-results-map-container'),
          ).toBeVisible();
          await expect(page.locator('.react-tabs')).toHaveCount(0);
        } else if (size[0] > phoneOrGreater) {
          await expect(
            page.locator('#vertical-oriented-left-controls'),
          ).toHaveCount(0);
          await expect(
            page.locator('.tablet-results-map-container'),
          ).toHaveCount(0);
          if (!isMobileMapUpdateEnabled) {
            await expect(page.locator('.react-tabs')).toBeVisible();
          } else {
            await expect(page.locator('.react-tabs')).toHaveCount(0);
            await expect(
              page.locator('.segmented-control-container'),
            ).toBeVisible();
          }
        }
      });
    }
  });
}
