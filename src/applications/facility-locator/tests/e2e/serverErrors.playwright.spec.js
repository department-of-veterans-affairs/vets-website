const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const {
  jsonResponse,
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featureSetsToTest) {
  const serviceDropdown = featureSet.some(
    isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
  )
    ? '.service-type-dropdown-desktop'
    : '.service-type-dropdown-tablet';

  test.describe(
    `Facility Locator error handling ${enabledFeatures(featureSet)}`,
    () => {
      test.beforeEach(async ({ page }) => {
        await page.route('**/v0/feature_toggles*', route =>
          route.fulfill(
            jsonResponse({
              data: { type: 'feature_toggles', features: featureSet },
            }),
          ),
        );
        await page.route('**/v0/maintenance_windows', route =>
          route.fulfill(jsonResponse([])),
        );
        await page.route('**/facilities_api/**', route =>
          route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'server error' }),
          }),
        );
      });

      test('shows error if API returns non-200 response', async ({ page }) => {
        await page.goto(h.ROOT_URL);

        const axeResults = await new AxeBuilder({ page }).analyze();
        expect(axeResults.violations).toHaveLength(0);

        await h.typeInCityStateInput(page, 'Austin, TX');
        await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.HEALTH);
        await page
          .locator(`${serviceDropdown} select`)
          .selectOption('Primary care');
        await h.submitSearchForm(page);

        await page.waitForResponse(resp =>
          resp.url().includes('facilities_api'),
        );

        await h.verifyElementShouldContainString(
          page,
          'h2.usa-alert-heading',
          "Find VA locations isn't working right now",
        );
        await h.verifyElementDoesNotExist(page, '#emergency-care-info-note');
      });

      test('shows 911 banner for emergency searches even on API error', async ({
        page,
      }) => {
        await page.goto(h.ROOT_URL);

        const axeResults = await new AxeBuilder({ page }).analyze();
        expect(axeResults.violations).toHaveLength(0);

        await h.typeInCityStateInput(page, 'Austin, TX');
        await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.EMERGENCY);
        await h.submitSearchForm(page);

        await page.waitForResponse(resp =>
          resp.url().includes('facilities_api'),
        );

        await h.verifyElementShouldContainString(
          page,
          'h2.usa-alert-heading',
          "Find VA locations isn't working right now",
        );

        const emergencyNote = page.locator('#emergency-care-info-note');
        await expect(emergencyNote).toContainText('call');
        await expect(emergencyNote).toContainText('911');
      });
    },
  );
}
