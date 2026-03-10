const { test, expect } = require('@playwright/test');
const {
  axeCheck,
} = require('../../../../platform/testing/e2e/playwright/helpers/axeCheck');
const mockFacilitiesSearchResultsV1 = require('../../constants/mock-facility-data-v1.json');
const mockFacilityDataV1 = require('../../constants/mock-facility-v1.json');
const mockGeocodingData = require('../../constants/mock-geocoding-data.json');
const mockLaLocation = require('../../constants/mock-la-location.json');
const mockServices = require('../../constants/mock-provider-services.json');
const {
  jsonResponse,
  setupCommonMocks,
} = require('./helpers/playwright-mocks');
const h = require('./helpers/playwright-helpers');

const CC_PROVIDER = 'Community providers (in VA\u2019s network)';
const healthServices = {
  All: 'All VA health services',
  PrimaryCare: 'Primary care',
  MentalHealth: 'Mental health care',
  Dental: 'Dental services',
  UrgentCare: 'Urgent care',
  EmergencyCare: 'Emergency care',
  Audiology: 'Audiology',
  Cardiology: 'Cardiology',
  Dermatology: 'Dermatology',
  Gastroenterology: 'Gastroenterology',
  Gynecology: 'Gynecology',
  Ophthalmology: 'Ophthalmology',
  Optometry: 'Optometry',
  Orthopedics: 'Orthopedics',
  Urology: 'Urology',
  WomensHealth: "Women's health",
  Podiatry: 'Podiatry',
  Nutrition: 'Nutrition',
  CaregiverSupport: 'Caregiver support',
};

async function verifyOptions(page) {
  await h.selectFacilityTypeInDropdown(page, 'VA health');
  const serviceDropdown = page.locator('.service-type-dropdown-tablet select');
  await expect(serviceDropdown).not.toBeDisabled();

  const hServices = Object.keys(healthServices);
  for (let i = 0; i < hServices.length; i++) {
    const option = serviceDropdown.locator('option').nth(i);
    await expect(option).toHaveAttribute('value', hServices[i]); // eslint-disable-line no-await-in-loop
  }

  await h.selectFacilityTypeInDropdown(page, 'Urgent care');
  await expect(serviceDropdown).not.toBeDisabled();

  await h.selectFacilityTypeInDropdown(page, 'Vet Centers');
  await h.selectFacilityTypeInDropdown(page, 'VA cemeteries');
  await h.selectFacilityTypeInDropdown(page, 'VA benefits');
  await expect(serviceDropdown).toBeDisabled();

  await h.selectFacilityTypeInDropdown(page, CC_PROVIDER);
  await expect(page.locator('#service-typeahead')).not.toBeDisabled();

  await h.selectFacilityTypeInDropdown(
    page,
    'Community pharmacies (in VA\u2019s network)',
  );
}

test.describe('Facility VA search', () => {
  test.beforeEach(async ({ page }) => {
    await setupCommonMocks(page);
    await page.route(new RegExp('facilities_api/v2/ccp/specialties'), route =>
      route.fulfill(jsonResponse(mockServices)),
    );
    await page.route(new RegExp('facilities_api/v2/ccp/provider'), route =>
      route.fulfill(jsonResponse(mockFacilitiesSearchResultsV1)),
    );
    await page.route(new RegExp('facilities_api/v2/va'), async route => {
      await route.fulfill(jsonResponse(mockFacilitiesSearchResultsV1));
    });
    await page.route(new RegExp('facilities_api/v2/va/vba_'), route =>
      route.fulfill(jsonResponse(mockFacilityDataV1)),
    );
  });

  test('does a simple search and finds a result on the list', async ({
    page,
  }) => {
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mockGeocodingData)),
    );

    await page.goto(h.ROOT_URL);

    expect(await axeCheck(page)).toHaveLength(0);

    await verifyOptions(page);

    await h.typeInCityStateInput(page, 'Austin, TX');
    await h.selectFacilityTypeInDropdown(page, 'VA health');
    await h.selectServiceTypeInVAHealthDropdown(page, 'Primary care');
    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
      /(Showing|Results).*VA health.*Primary care.*near.*Austin, Texas/i,
    );
    await expect(page.locator('.facility-result a').first()).toBeVisible();
    await expect(page.locator('.i-pin-card-map').first()).toContainText('1');
    await expect(page.locator('.i-pin-card-map').nth(1)).toContainText('2');
    await expect(page.locator('.i-pin-card-map').nth(2)).toContainText('3');
    await expect(page.locator('.i-pin-card-map').nth(3)).toContainText('4');
  });

  test('shows search result header even when no results are found', async ({
    page,
  }) => {
    await page.route(new RegExp('facilities_api/v2/ccp/provider'), route =>
      route.fulfill(
        jsonResponse({
          data: [],
          meta: { pagination: { totalEntries: 0 } },
        }),
      ),
    );

    await page.goto(h.ROOT_URL);

    expect(await axeCheck(page)).toHaveLength(0);

    await h.typeInCityStateInput(page, '27606');
    await h.selectFacilityTypeInDropdown(page, CC_PROVIDER);
    await page.locator('#service-type-ahead-input').fill('General');
    await page.locator('#downshift-1-item-0').click();
    await h.submitSearchForm(page);

    const focused = page.locator(':focus');
    await expect(focused).toContainText(
      /No results found for.*Community providers.*General Acute Care Hospital.*near.*Austin.*Texas/i,
    );
  });

  test('finds va benefits facility and views its page', async ({ page }) => {
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mockLaLocation)),
    );

    await page.goto(h.ROOT_URL);

    await h.typeInCityStateInput(page, 'Los Angeles');
    await h.selectFacilityTypeInDropdown(page, 'VA benefits');
    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
      /(Showing|Results).*VA benefits.*All VA benefit services.*near.*Los Angeles.*California/i,
    );

    expect(await axeCheck(page)).toHaveLength(0);

    await expect(page.locator('.facility-result a').first()).toContainText(
      'VetSuccess on Campus at Los Angeles City College',
    );
    await page
      .getByRole('link', {
        name: /VetSuccess on Campus at Los Angeles City College/i,
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

    await page.locator(h.CITY_STATE_ZIP_INPUT).fill('27606');
    await page.locator(h.CITY_STATE_ZIP_INPUT).press('Enter');

    await page.waitForTimeout(8000);

    await expect(page.locator(h.CITY_STATE_ZIP_INPUT)).toHaveValue('27606');
    await expect(page.locator('#va-modal-title')).toHaveCount(0);
  });

  test('finds VA emergency care', async ({ page }) => {
    await page.goto(h.ROOT_URL);

    await h.typeInCityStateInput(page, 'Alexandria Virginia');
    await h.selectFacilityTypeInDropdown(page, 'Emergency care');
    await h.selectServiceTypeInVAHealthDropdown(page, 'VA emergency care');
    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
      /Results.*Emergency Care.*VA emergency care.*near.*Austin.*Texas/i,
    );
    await expect(page.locator('#emergency-care-info-note')).toBeVisible();
    await expect(
      page.locator('.facility-result h3 va-link a').first(),
    ).toContainText('Alexandria Vet Center');

    expect(await axeCheck(page)).toHaveLength(0);
  });

  test('does not trigger repeat API requests', async ({ page }) => {
    let searchCallCount = 0;
    await page.route(new RegExp('facilities_api/v2/va'), async route => {
      if (route.request().method() === 'POST') {
        searchCallCount += 1;
        await route.fulfill(jsonResponse(mockFacilitiesSearchResultsV1));
      } else {
        await route.continue();
      }
    });
    await page.route(new RegExp('geocoding/'), route =>
      route.fulfill(jsonResponse(mockGeocodingData)),
    );

    await page.goto(h.ROOT_URL);

    await verifyOptions(page);

    await h.typeInCityStateInput(page, 'Austin, TX');
    await h.selectFacilityTypeInDropdown(page, 'VA health');
    await h.selectServiceTypeInVAHealthDropdown(page, 'Primary care');

    await h.submitSearchForm(page);
    await h.submitSearchForm(page);

    await h.selectFacilityTypeInDropdown(page, 'VA health');
    await h.selectServiceTypeInVAHealthDropdown(page, 'Primary care');
    await h.submitSearchForm(page);
    await h.submitSearchForm(page);

    await expect(page.locator(h.SEARCH_RESULTS_SUMMARY)).toHaveText(
      /(Showing|Results).*VA health.*Primary care.*near.*Austin, Texas/i,
    );

    expect(searchCallCount).toBe(2);

    await expect(page.locator('.facility-result a').first()).toBeVisible();
    await expect(page.locator('.i-pin-card-map').first()).toContainText('1');
  });
});
