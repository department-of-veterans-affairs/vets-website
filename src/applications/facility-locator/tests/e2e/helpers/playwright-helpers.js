/**
 * Playwright helpers for facility-locator E2E tests.
 * Ports the Cypress helpers from ./index.js to Playwright equivalents.
 */
const { expect } = require('@playwright/test');

// Selectors (same as Cypress helpers)
const ROOT_URL = '/find-locations';
const MAP_CONTAINER = '#mapbox-gl-container';
const CITY_STATE_ZIP_INPUT = '#street-city-state-zip';
const FACILITY_TYPE_DROPDOWN = '#facility-type-dropdown';
const VA_HEALTH_SERVICE_DROPDOWN = '#service-type-dropdown';
const CCP_SERVICE_TYPE_INPUT = '#service-type-ahead-input';
const SEARCH_BUTTON = '#facility-search';
const SEARCH_AVAILABLE = '#search-available-service-prompt';
const NO_SERVICE = '#could-not-find-service-prompt';
const AUTOSUGGEST_ADDRESS_INPUT =
  '[data-testid="street-city-state-zip-input-with-clear"]';
const AUTOSUGGEST_ADDRESS_CONTAINER =
  '#street-city-state-zip-autosuggest-container';
const AUTOSUGGEST_ADDRESS_OPTIONS = '[data-testid="autosuggest-options"]';
const AUTOSUGGEST_INPUT = '[data-testid="vamc-services-input-with-clear"]';
const AUTOSUGGEST_ARROW =
  '[data-e2e-id="vamc-services-autosuggest-arrow-button"]';
const AUTOSUGGEST_CLEAR = '#clear-vamc-services';
const OPTIONS = 'p[role="option"]';

const FACILITY_LISTING_CONTAINER = '.facility-result';
const FACILITY_DISTANCE = '[data-testid="fl-results-distance"]';
const FACILITY_ADDRESS = '[data-testid="facility-result-address"]';
const DIRECTIONS_LINK = 'va-link[text="Get directions on Google Maps"]';
const MAIN_PHONE = '[data-testid="Main phone"]';
const VA_HEALTH_CONNECT_NUMBER = '[data-testid="VA health connect"]';
const MENTAL_HEALTH_NUMBER = '[data-testid="Mental health"]';
const TTY_NUMBER = 'va-telephone[contact="711"]';

const SEARCH_RESULTS_SUMMARY = '#search-results-subheader';

const MOBILE_MAP_PIN_SELECT_HELP_TEXT =
  'Select a number to show information about that location.';
const MOBILE_MAP_NO_RESULTS_TEXT =
  'Try searching for something else. Or try searching in a different area.';
const MOBILE_LIST_SEARCH_TEXT =
  'Enter a location (street, city, state, or zip code) and facility type, then search to find facilities.';
const MOBILE_TAB_BUTTON = 'button[class*="segment"]';
const MOBILE_MAP_RESULT_CONTAINER = '.mobile-search-result';

const SEARCH_FORM_ERROR_MESSAGE = '.usa-input-error-message';
const SEARCH_FORM_ERROR_MESSAGE_2 = '.usa-error-message';

const FACILITY_TYPES = {
  HEALTH: 'VA health',
  URGENT: 'Urgent care',
  EMERGENCY: 'Emergency care',
  CC_PRO: 'Community providers (in VA\u2019s network)',
  CC_PHARM: 'Community pharmacies (in VA\u2019s network)',
  VBA: 'VA benefits',
  CEM: 'VA cemeteries',
  VET: 'Vet Centers',
};

// --- Helper functions ---

async function typeInCityStateInput(page, value, shouldCloseDropdown = false) {
  await page.locator(CITY_STATE_ZIP_INPUT).fill(value);
  if (shouldCloseDropdown) {
    await page.locator(CITY_STATE_ZIP_INPUT).press('Escape');
  }
}

async function typeInAutosuggestInput(page, value) {
  await page.locator(AUTOSUGGEST_INPUT).fill(value);
}

async function typeAndSelectInCCPServiceTypeInput(page, value) {
  await page.locator(CCP_SERVICE_TYPE_INPUT).fill(value);
  await page
    .getByText(value, { exact: true })
    .first()
    .click();
}

async function typeInCCPServiceTypeInput(page, value) {
  await page.locator(CCP_SERVICE_TYPE_INPUT).fill(value);
}

async function clearInput(page, selector) {
  await page.locator(selector).clear();
  await expect(page.locator(selector)).toHaveValue('');
}

async function vaSelectSelect(page, value, dropdownSelector) {
  await page
    .locator(dropdownSelector)
    .locator('select')
    .selectOption(value, { force: true });
}

async function selectFacilityTypeInDropdown(page, value) {
  await vaSelectSelect(page, value, FACILITY_TYPE_DROPDOWN);
}

async function selectServiceTypeInVAHealthDropdown(page, value) {
  await page.locator(VA_HEALTH_SERVICE_DROPDOWN).selectOption(value);
}

async function submitSearchForm(page) {
  await page.locator(SEARCH_BUTTON).click();
}

async function clickElement(page, selector) {
  await page
    .locator(selector)
    .first()
    .click();
}

async function verifyMainNumber(page, number) {
  const mainPhone = page.locator(MAIN_PHONE);
  await expect(mainPhone).toBeVisible();
  await expect(mainPhone).toContainText('Main phone');
  const tel = mainPhone
    .locator('va-telephone')
    .first()
    .locator('a');
  await expect(tel).toHaveText(number);
}

async function verifyHealthConnectNumber(page, number) {
  const el = page.locator(VA_HEALTH_CONNECT_NUMBER);
  await expect(el).toBeVisible();
  await expect(el).toContainText('VA health connect');
  const tel = el
    .locator('va-telephone')
    .first()
    .locator('a');
  await expect(tel).toHaveText(number);
}

async function verifyMentalHealthNumber(page, number) {
  const el = page.locator(MENTAL_HEALTH_NUMBER);
  await expect(el).toBeVisible();
  await expect(el).toContainText('Mental health');
  const tel = el
    .locator('va-telephone')
    .first()
    .locator('a');
  await expect(tel).toHaveText(number);
}

async function verifyTTYNumber(page) {
  await expect(page.locator(TTY_NUMBER)).toBeVisible();
}

async function verifyListingContents(page, container, details) {
  const pin = container.locator('.i-pin-card-map');
  await expect(pin).toHaveText(String(details.pin));

  if (details.website) {
    const link = container
      .locator('va-link')
      .nth(details.index)
      .locator('a');
    await expect(link).toHaveText(details.name);
    await expect(link).toHaveAttribute('href', details.website);
  } else {
    const heading = container.locator('h3').nth(details.index);
    await expect(heading).toHaveText(details.name);
  }

  const distance = container.locator(FACILITY_DISTANCE);
  await expect(distance).toHaveText(details.distance);

  const address = container.locator(FACILITY_ADDRESS);
  await expect(address).toHaveText(
    `${details.addressLine1}${details.addressLine2}`,
  );

  await expect(container.locator(DIRECTIONS_LINK)).toBeVisible();
}

async function verifyMobileListItem(page, details, index) {
  const container = page.locator(FACILITY_LISTING_CONTAINER).nth(index);
  await container.scrollIntoViewIfNeeded();
  await expect(container).toBeVisible();
  await verifyListingContents(page, container, details);
}

async function selectMobileMapTab(page) {
  await page
    .locator(MOBILE_TAB_BUTTON)
    .nth(1)
    .click();
}

async function selectMobileMapPin(page, index) {
  await page.locator(`.pin-${index}`).scrollIntoViewIfNeeded();
  await page.locator(`.pin-${index}`).click();
}

async function verifyMobileMapItem(page, details) {
  const container = page.locator(MOBILE_MAP_RESULT_CONTAINER).first();
  await expect(container).toBeVisible();
  await verifyListingContents(page, container, details);
}

async function awaitMapRender(page) {
  // Wait for map tiles to load
  await page.waitForTimeout(3000);
}

async function verifyElementExists(page, selector) {
  await expect(page.locator(selector).first()).toBeVisible();
}

async function verifyElementByText(page, text) {
  await expect(page.getByText(text).first()).toBeVisible();
}

async function scrollToThenVerifyElementByText(page, text) {
  const el = page.getByText(text).first();
  await el.scrollIntoViewIfNeeded();
  await expect(el).toBeVisible();
  return el;
}

async function verifyElementShouldContainText(page, selector, text) {
  const el = page.locator(selector).first();
  await expect(el).toBeVisible();
  await expect(el).toContainText(text);
}

async function verifyElementShouldContainString(page, selector, regex) {
  const el = page.locator(selector).first();
  await expect(el).toBeVisible();
  if (regex instanceof RegExp) {
    await expect(el).toHaveText(regex);
  } else {
    await expect(el).toContainText(regex);
  }
}

async function verifyElementDoesNotExist(page, selector) {
  await expect(page.locator(selector)).toHaveCount(0);
}

async function verifyElementIsNotDisabled(page, selector) {
  await expect(page.locator(selector)).not.toBeDisabled();
}

async function errorMessageContains(page, text) {
  await verifyElementShouldContainText(page, SEARCH_FORM_ERROR_MESSAGE, text);
}

async function errorMessageContains2(page, text) {
  await verifyElementShouldContainText(page, SEARCH_FORM_ERROR_MESSAGE_2, text);
}

async function elementIsFocused(page, selector) {
  await expect(page.locator(selector)).toBeFocused();
}

async function focusElement(page, selector) {
  await page.locator(selector).focus();
}

// --- Mock setup helpers ---

async function setupCommonMocks(page, featureSet = []) {
  await page.route('**/v0/feature_toggles*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { features: featureSet } }),
    }),
  );
  await page.route('**/v0/maintenance_windows', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    }),
  );
}

module.exports = {
  ROOT_URL,
  MAP_CONTAINER,
  CITY_STATE_ZIP_INPUT,
  FACILITY_TYPE_DROPDOWN,
  VA_HEALTH_SERVICE_DROPDOWN,
  CCP_SERVICE_TYPE_INPUT,
  SEARCH_BUTTON,
  SEARCH_AVAILABLE,
  NO_SERVICE,
  AUTOSUGGEST_ADDRESS_INPUT,
  AUTOSUGGEST_ADDRESS_CONTAINER,
  AUTOSUGGEST_ADDRESS_OPTIONS,
  AUTOSUGGEST_INPUT,
  AUTOSUGGEST_ARROW,
  AUTOSUGGEST_CLEAR,
  OPTIONS,
  FACILITY_LISTING_CONTAINER,
  FACILITY_DISTANCE,
  FACILITY_ADDRESS,
  DIRECTIONS_LINK,
  MAIN_PHONE,
  VA_HEALTH_CONNECT_NUMBER,
  MENTAL_HEALTH_NUMBER,
  TTY_NUMBER,
  SEARCH_RESULTS_SUMMARY,
  MOBILE_MAP_PIN_SELECT_HELP_TEXT,
  MOBILE_MAP_NO_RESULTS_TEXT,
  MOBILE_LIST_SEARCH_TEXT,
  MOBILE_TAB_BUTTON,
  MOBILE_MAP_RESULT_CONTAINER,
  SEARCH_FORM_ERROR_MESSAGE,
  SEARCH_FORM_ERROR_MESSAGE_2,
  FACILITY_TYPES,
  typeInCityStateInput,
  typeInAutosuggestInput,
  typeAndSelectInCCPServiceTypeInput,
  typeInCCPServiceTypeInput,
  clearInput,
  vaSelectSelect,
  selectFacilityTypeInDropdown,
  selectServiceTypeInVAHealthDropdown,
  submitSearchForm,
  clickElement,
  verifyMainNumber,
  verifyHealthConnectNumber,
  verifyMentalHealthNumber,
  verifyTTYNumber,
  verifyListingContents,
  verifyMobileListItem,
  selectMobileMapTab,
  selectMobileMapPin,
  verifyMobileMapItem,
  awaitMapRender,
  verifyElementExists,
  verifyElementByText,
  scrollToThenVerifyElementByText,
  verifyElementShouldContainText,
  verifyElementShouldContainString,
  verifyElementDoesNotExist,
  verifyElementIsNotDisabled,
  errorMessageContains,
  errorMessageContains2,
  elementIsFocused,
  focusElement,
  setupCommonMocks,
};
