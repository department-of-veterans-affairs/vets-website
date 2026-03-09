const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const mockFacilityDataV1 = require('../../constants/mock-facility-v1.json');
const mockLaLocation = require('../../constants/mock-la-location.json');
const {
  jsonResponse,
  setupCommonMocks,
  setupVAFacilityMocks,
  setupCCPMocks,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const PROG_DISC_FEATURE = [
  { name: 'facilities_use_fl_progressive_disclosure', value: true },
];

test.describe('Facility VA search (progressive disclosure)', () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page, PROG_DISC_FEATURE);
    await setupCCPMocks(page);
    await setupVAFacilityMocks(page);
  });

  test('does a simple search and finds a result on the list', async ({
    page,
  }) => {
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mockGeocodingData)),
    );

    await page.goto(h.ROOT_URL);

    expect(await axeCheck(page)).toHaveLength(0);

    await h.typeInCityStateInput(page, 'Austin, TX');
    await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.HEALTH);
    await page.locator('#service-type-dropdown').selectOption('Primary care');
    await page.locator('#facility-search').click();

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
      /(Showing|Results).*VA health.*Primary care.*near.*Austin, Texas/i,
    );
    await expect(page.locator('.facility-result a').first()).toBeVisible();
    await expect(page.locator('.i-pin-card-map').first()).toContainText('1');
    await expect(page.locator('.i-pin-card-map').nth(1)).toContainText('2');
    await expect(page.locator('.i-pin-card-map').nth(2)).toContainText('3');
  });

  test('shows search result header even when no results are found', async ({
    page,
  }) => {
    // Override CCP mock to return no data
    await setupCCPMocks(page, '');

    await page.goto(h.ROOT_URL);

    expect(await axeCheck(page)).toHaveLength(0);

    await h.typeInCityStateInput(page, '27606');
    await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.CC_PRO);
    await expect(page.locator('#service-typeahead')).not.toHaveAttribute(
      'disabled',
    );
    await h.typeAndSelectInCCPServiceTypeInput(
      page,
      'General Acute Care Hospital',
    );

    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toBeVisible();
    const focused = page.locator(':focus');
    await expect(focused).toContainText(
      /No results found for.*Community providers.*General Acute Care Hospital.*near.*Austin.*Texas/i,
    );
  });

  test('finds va benefits facility and views its page', async ({ page }) => {
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mockLaLocation)),
    );
    // Provide complete facility detail data for vba_ routes
    await page.route(new RegExp('facilities_api/v2/va/vba_'), route =>
      route.fulfill(jsonResponse(mockFacilityDataV1)),
    );

    await page.goto(h.ROOT_URL);

    await h.typeInCityStateInput(page, 'Los Angeles, CA');
    await h.selectFacilityTypeInDropdown(page, 'VA benefits');
    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
      /(Showing|Results).*VA benefits.*All VA benefit services.*Los Angeles.*California/i,
    );

    expect(await axeCheck(page)).toHaveLength(0);

    await expect(page.locator('.facility-result a').first()).toContainText(
      'Los Angeles Ambulatory Care Center',
    );
    await page
      .getByRole('link', {
        name: /Los Angeles Ambulatory Care Center/i,
      })
      .first()
      .click();

    await expect(page.locator('h1')).toContainText('Austin VA Clinic');
    await expect(page.locator('.p1').first()).toBeVisible();
    await expect(page.locator('.facility-phone-group')).toBeVisible();
    await expect(page.getByText(/Get directions/i).first()).toBeVisible();
    await expect(page.locator('[alt="Static map"]')).toBeVisible();
    await expect(page.locator('#hours-op h3')).toContainText(
      'Hours of operation',
    );

    expect(await axeCheck(page)).toHaveLength(0);
  });

  test('should not trigger Use My Location when pressing enter', async ({
    page,
  }) => {
    await page.goto(h.ROOT_URL);

    expect(await axeCheck(page)).toHaveLength(0);

    await h.typeInCityStateInput(page, '27606');

    await page.waitForTimeout(8000);

    await expect(page.locator(h.CITY_STATE_ZIP_INPUT)).toHaveValue('27606');
    await expect(page.locator('#va-modal-title')).toHaveCount(0);
  });

  test('finds VA emergency care', async ({ page }) => {
    await page.goto(h.ROOT_URL);

    await h.typeInCityStateInput(page, 'Austin, TX');
    await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.EMERGENCY);
    await h.selectServiceTypeInVAHealthDropdown(page, 'VA emergency care');
    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toContainText(
      'Results for "Emergency Care", "VA emergency care" near "Austin, Texas"',
    );
    await expect(page.locator('#emergency-care-info-note')).toBeVisible();
    await expect(
      page.locator('.facility-result h3 va-link a').first(),
    ).toContainText('Washington VA Medical Center');

    expect(await axeCheck(page)).toHaveLength(0);
  });
});
