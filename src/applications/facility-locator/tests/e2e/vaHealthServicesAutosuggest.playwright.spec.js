const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const vaHealthServicesData = require('../hooks/test-va-healthcare-services.json');
const searchResultsData = require('./autosuggest-data/services-autosuggest.json');
const h = require('./helpers/playwright-helpers');
const { jsonResponse } = require('./helpers/playwright-mocks');

test.describe('VA health services autosuggest', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/v0/feature_toggles*', route =>
      route.fulfill(
        jsonResponse({
          data: {
            features: [
              {
                name: 'facilities_autosuggest_vamc_services_enabled',
                value: true,
              },
              {
                name: 'facilities_use_fl_progressive_disclosure',
                value: true,
              },
            ],
          },
        }),
      ),
    );

    await page.route('**/data/cms/va-healthcare-services.json', route =>
      route.fulfill(jsonResponse(vaHealthServicesData.data)),
    );

    await page.route('**/facilities_api/v2/va', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill(jsonResponse(searchResultsData));
      } else {
        await route.continue();
      }
    });

    await page.route('**/v0/maintenance_windows', route =>
      route.fulfill(jsonResponse([])),
    );
  });

  test('should correctly load the basic view and interact with autosuggest', async ({
    page,
  }) => {
    await page.goto(h.ROOT_URL);

    const axeResults = await new AxeBuilder({ page }).analyze();
    expect(axeResults.violations).toHaveLength(0);

    await h.typeInCityStateInput(page, 'Atlanta, GA');
    await h.selectFacilityTypeInDropdown(page, h.FACILITY_TYPES.HEALTH);

    // Wait for VA health services data
    await page.waitForResponse(resp =>
      resp.url().includes('va-healthcare-services.json'),
    );

    await h.verifyElementExists(page, h.AUTOSUGGEST_INPUT);

    // Clicking the arrow should NOT open the dropdown when empty
    await h.clickElement(page, h.AUTOSUGGEST_ARROW);

    await expect(page.locator(h.AUTOSUGGEST_INPUT)).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await h.submitSearchForm(page);

    // Wait for search results
    await page.waitForResponse(resp =>
      resp.url().includes('facilities_api/v2/va'),
    );

    await h.verifyElementShouldContainString(
      page,
      h.SEARCH_RESULTS_SUMMARY,
      'results for "VA health", "All VA health services" near "Atlanta, Georgia',
    );

    await h.clickElement(page, h.AUTOSUGGEST_CLEAR);

    // Type a string, select a result and search
    await h.typeInAutosuggestInput(page, 'Pol');

    await expect(page.locator(h.AUTOSUGGEST_INPUT)).toHaveAttribute(
      'aria-expanded',
      'true',
      { timeout: 5000 },
    );

    await page.locator(h.AUTOSUGGEST_INPUT).press('ArrowDown');
    await page.locator(h.AUTOSUGGEST_INPUT).press('ArrowDown');
    await page.locator(h.AUTOSUGGEST_INPUT).press('Enter');

    await expect(page.locator(h.AUTOSUGGEST_INPUT)).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await h.submitSearchForm(page);

    await h.verifyElementShouldContainString(
      page,
      h.SEARCH_RESULTS_SUMMARY,
      'results for "VA health", "Polytrauma and traumatic brain injury (TBI and multiple traumas)" near "Atlanta, Georgia"',
    );

    await h.clickElement(page, h.AUTOSUGGEST_ARROW);

    await expect(
      page.locator('#vamc-services-autosuggest-container').locator(h.OPTIONS),
    ).toHaveCount(2);

    // Erase part of the service name to trigger filter
    const input = page.locator(h.AUTOSUGGEST_INPUT);
    await input.focus();
    await input.press('Backspace');
    await input.press('Backspace');
    await input.press('Backspace');

    await h.scrollToThenVerifyElementByText(page, 'No results found.');

    await h.clickElement(page, h.AUTOSUGGEST_CLEAR);

    // New search with a different service
    await h.typeInAutosuggestInput(page, 'cancer');

    await expect(page.locator(h.AUTOSUGGEST_INPUT)).toHaveAttribute(
      'aria-expanded',
      'true',
      { timeout: 5000 },
    );

    await page.getByText('Cancer care').click();

    await expect(page.locator(h.AUTOSUGGEST_INPUT)).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await h.clickElement(page, h.AUTOSUGGEST_CLEAR);

    // New search with an invalid service
    await h.typeInAutosuggestInput(page, 'INVALID');
    await h.verifyElementByText(page, 'No results found.');

    // Click out of the autosuggest input
    await page.locator('.desktop-search-controls-container').click();

    await h.submitSearchForm(page);

    await h.verifyElementShouldContainText(
      page,
      h.SEARCH_RESULTS_SUMMARY,
      'All VA health services',
    );
  });
});
