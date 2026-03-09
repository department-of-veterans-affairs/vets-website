/* eslint-disable no-await-in-loop */
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const {
  jsonResponse,
  setupCCPMocks,
  featureCombinationsTogglesToTest,
  isFeatureEnabled,
  enabledFeatures,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const CC_PROVIDER = 'Community providers (in VA\u2019s network)';
const NON_VA_URGENT_CARE = 'In-network community urgent care';

const featureSetsToTest = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featureSetsToTest) {
  const isProgDiscEnabled = featureSet.some(
    isFeatureEnabled('facilities_use_fl_progressive_disclosure'),
  );
  const serviceDropdown = isProgDiscEnabled
    ? '.service-type-dropdown-desktop'
    : '.service-type-dropdown-tablet';

  test.describe(`Provider search - ${enabledFeatures(featureSet)}`, () => {
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
      await setupCCPMocks(page, '1223X2210X');
      // Also set up additional provider type mocks
      await setupCCPMocks(page, '261QE0002X');
      await setupCCPMocks(page, '261QU0200X');
      await page.route('**/geocoding/**', route =>
        route.fulfill(jsonResponse(mockGeocodingData)),
      );
    });

    test('renders "Search for available service" prompt', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Austin, TX');
      await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);

      await page.waitForResponse(resp =>
        resp.url().includes('facilities_api/v2/ccp/specialties'),
      );

      await h.verifyElementIsNotDisabled(page, h.CCP_SERVICE_TYPE_INPUT);
      await h.focusElement(page, h.CCP_SERVICE_TYPE_INPUT);

      if (!isProgDiscEnabled) {
        await h.verifyElementExists(page, h.SEARCH_AVAILABLE);
      }

      await h.typeInCCPServiceTypeInput(page, 'D');

      if (!isProgDiscEnabled) {
        await h.verifyElementExists(page, h.SEARCH_AVAILABLE);
      }

      await h.typeInCCPServiceTypeInput(page, 'De');
      await h.verifyElementDoesNotExist(page, h.SEARCH_AVAILABLE);
    });

    test('renders "could not find service" prompt', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Austin, TX');
      await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);

      await page.waitForResponse(resp =>
        resp.url().includes('facilities_api/v2/ccp/specialties'),
      );

      await h.typeInCCPServiceTypeInput(page, 'djf');
      await h.verifyElementExists(page, h.NO_SERVICE);
    });

    test('finds community dentists', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Austin, TX');
      await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);

      await page.waitForResponse(resp =>
        resp.url().includes('facilities_api/v2/ccp/specialties'),
      );

      await h.typeInCCPServiceTypeInput(page, 'Dentist');
      await h.clickElement(page, '#downshift-1-item-0');
      await h.submitSearchForm(page);

      await h.verifyElementShouldContainString(
        page,
        h.SEARCH_RESULTS_SUMMARY,
        /(Showing|results).*Community providers.*Dentist - Orofacial Pain.*near.*Austin, Texas/i,
      );

      await h.verifyElementShouldContainText(
        page,
        '.facility-result h3',
        'Kerr, Max Olen',
      );
      await h.verifyElementDoesNotExist(page, '.va-pagination');
    });

    test('finds community urgent care - Clinic/Center', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Austin, TX');
      await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);

      await page.waitForResponse(resp =>
        resp.url().includes('facilities_api/v2/ccp/specialties'),
      );

      await h.typeInCCPServiceTypeInput(page, 'Clinic/Center - Urgent Care');
      await h.clickElement(page, '#downshift-1-item-0');
      await h.submitSearchForm(page);

      await h.verifyElementShouldContainString(
        page,
        h.SEARCH_RESULTS_SUMMARY,
        `results for "${CC_PROVIDER}", "Clinic/Center - Urgent Care" near "Austin, Texas"`,
      );

      await h.verifyElementShouldContainText(
        page,
        '.facility-result h3',
        'MinuteClinic',
      );
      await h.verifyElementDoesNotExist(page, '.va-pagination');
    });

    test('finds community urgent care via Urgent type', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Austin, TX');
      await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.URGENT);
      await page
        .locator(`${serviceDropdown} select`)
        .selectOption(NON_VA_URGENT_CARE);
      await h.submitSearchForm(page);

      await h.verifyElementShouldContainString(
        page,
        h.SEARCH_RESULTS_SUMMARY,
        `Results for "Urgent care", "${NON_VA_URGENT_CARE}" near "Austin, Texas"`,
      );

      await h.verifyElementShouldContainText(
        page,
        '.facility-result h3',
        'MinuteClinic',
      );
      await h.verifyElementDoesNotExist(page, '.va-pagination');
    });

    test('finds In-network community emergency care', async ({ page }) => {
      await page.goto(h.ROOT_URL);

      const axeResults = await new AxeBuilder({ page }).analyze();
      expect(axeResults.violations).toHaveLength(0);

      await h.typeInCityStateInput(page, 'Austin, TX');
      await page.locator(h.CITY_STATE_ZIP_INPUT).press('Escape');
      await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.EMERGENCY);
      await page
        .locator(`${serviceDropdown} select`)
        .selectOption('In-network community emergency care');
      await h.submitSearchForm(page);

      await h.verifyElementShouldContainString(
        page,
        h.SEARCH_RESULTS_SUMMARY,
        'Results for "Emergency Care", "In-network community emergency care" near "Austin, Texas"',
      );

      await h.verifyElementExists(page, '#emergency-care-info-note');
      await h.verifyElementShouldContainText(
        page,
        '.facility-result h3',
        'DELL SETON MEDICAL CENTER AT UT',
      );
    });
  });
}
