/* eslint-disable no-await-in-loop */
const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const {
  jsonResponse,
  setupVAFacilityMocks,
  setupCCPMocks,
  featureCombinationsTogglesToTest,
  enabledFeatures,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const featureSets = featureCombinationsTogglesToTest([
  'facilities_use_fl_progressive_disclosure',
]);

for (const featureSet of featureSets) {
  test.describe(
    `Facility search error messages ${enabledFeatures(featureSet)}`,
    () => {
      const addrErrorMessage =
        'Enter a zip code or a city and state in the search box';
      const faciltyErrorMessage = 'Select a facility type';

      test.beforeEach(async ({ page }) => {
        await h.setupMapboxStubs(page);
        await page.route(/maintenance_windows/, route =>
          route.fulfill(jsonResponse([])),
        );
        await page.route('**/v0/feature_toggles*', route =>
          route.fulfill(jsonResponse({ data: { features: featureSet } })),
        );
        await setupCCPMocks(page, '1223X2210X');
        await setupVAFacilityMocks(page);

        await page.goto(h.ROOT_URL);

        expect(await axeCheck(page)).toHaveLength(0);
      });

      test('shows error message in location field on invalid search', async ({
        page,
      }) => {
        await h.submitSearchForm(page);
        await h.errorMessageContains(page, addrErrorMessage);
        await h.elementIsFocused(page, h.CITY_STATE_ZIP_INPUT);
      });

      test('shows error message on leaving location field empty', async ({
        page,
      }) => {
        await h.focusElement(page, h.CITY_STATE_ZIP_INPUT);
        await page
          .locator(h.FACILITY_TYPE_DROPDOWN)
          .locator('select')
          .focus();

        await h.submitSearchForm(page);
        await h.errorMessageContains(page, addrErrorMessage);
      });

      test('shows error when leaving facility type field empty', async ({
        page,
      }) => {
        await h.typeInCityStateInput(page, 'Austin, TX', true);
        await page
          .locator(h.FACILITY_TYPE_DROPDOWN)
          .locator('select')
          .focus();
        await h.submitSearchForm(page);

        await expect(
          page.locator(h.FACILITY_TYPE_DROPDOWN).locator('.usa-error-message'),
        ).toContainText('Select a facility type');

        await h.errorMessageContains2(page, faciltyErrorMessage);

        await h.selectFacilityTypeInDropdown(page, 'VA health');
      });

      test('shows error when leaving service type field empty', async ({
        page,
      }) => {
        await h.typeInCityStateInput(page, 'Austin, TX');
        await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);

        // Wait for services to load
        await page.waitForResponse(resp =>
          resp.url().includes('facilities_api/v2/ccp/specialties'),
        );

        await h.verifyElementIsNotDisabled(page, h.CCP_SERVICE_TYPE_INPUT);
        await h.submitSearchForm(page);
        await expect(page.locator('#error-message')).toContainText(
          'Start typing and select a service type',
        );
        await h.typeAndSelectInCCPServiceTypeInput(
          page,
          'Clinic/Center - Urgent Care',
        );
      });

      test('shows error when typing back pain without selecting service', async ({
        page,
      }) => {
        await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);
        await h.typeInCCPServiceTypeInput(page, 'back pain');
        await h.submitSearchForm(page);
        await expect(page.locator('#error-message')).toContainText(
          'Start typing and select a service type',
        );
      });

      test('no error after selecting service then tabbing', async ({
        page,
      }) => {
        await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);
        await h.typeAndSelectInCCPServiceTypeInput(
          page,
          'Clinic/Center - Urgent Care',
        );
        await page
          .locator(h.FACILITY_TYPE_DROPDOWN)
          .locator('select')
          .focus();

        await h.verifyElementExists(page, h.CCP_SERVICE_TYPE_INPUT);
        await h.verifyElementDoesNotExist(page, h.SEARCH_FORM_ERROR_MESSAGE_2);
      });

      test('shows error when deleting service after search', async ({
        page,
      }) => {
        await h.typeInCityStateInput(page, 'Austin, TX');
        await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);

        await page.waitForResponse(resp =>
          resp.url().includes('facilities_api/v2/ccp/specialties'),
        );

        await h.typeAndSelectInCCPServiceTypeInput(
          page,
          'Dentist - Orofacial Pain',
        );
        await h.submitSearchForm(page);

        await h.verifyElementShouldContainString(
          page,
          h.SEARCH_RESULTS_SUMMARY,
          /(Showing|results).*Community providers.*Dentist - Orofacial Pain.*Austin, Texas/i,
        );

        await h.clearInput(page, h.CCP_SERVICE_TYPE_INPUT);
        await h.submitSearchForm(page);
        await expect(page.locator('#error-message')).toContainText(
          'Start typing and select a service type',
        );
      });
    },
  );
}
