import { formatCurrency } from '../../utils/helpers';

const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const autocomplete = require('../data/autocomplete.json');
const institutionProfile = require('../data/institution-profile.json');
const searchResults = require('../data/search-results.json');
const calculatorConstants = require('../data/calculator-constants.json');
const featureToggles = require('../data/feature-toggles.json');
const mock = require('../../../../platform/testing/e2e/mock-helpers');

const institutionAttributes = institutionProfile.data.attributes;

// Expects navigation lands at a path containing the given `urlSubstring`.
const expectLocation = (client, urlSubstring) => {
  client.assert.urlContains(urlSubstring);
};

// Create API routes
const initApplicationMock = () => {
  mock(null, {
    path: '/v0/gi/institutions/search',
    verb: 'get',
    value: searchResults,
  });

  mock(null, {
    path: `/v0/gi/institutions/${institutionAttributes.facility_code}`,
    verb: 'get',
    value: institutionProfile,
  });

  mock(null, {
    path: '/v0/gi/calculator_constants',
    verb: 'get',
    value: calculatorConstants,
  });

  mock(null, {
    path: '/v0/gi/institutions/autocomplete',
    verb: 'get',
    value: autocomplete,
  });

  mock(null, {
    path: '/v0/feature_toggles',
    verb: 'get',
    value: featureToggles,
  });

  mock(null, {
    path: '/v0/maintenance_windows',
    verb: 'get',
    value: {},
  });
};

const searchForInstitution = client => {
  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', institutionAttributes.name)
    .click('#search-button');
};

const selectFirstSearchResult = client => {
  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main')
    .waitForElementVisible('.search-result a', Timeouts.normal)
    .click('.search-result a');
};

const expandCollapseAccordion = (client, id) =>
  client
    .waitForElementVisible(id, Timeouts.normal)
    .click(`${id} button`)
    .click(`${id} button`);

/**
 * Main sections are expanded on page load, this collapses then expands a section
 * @param client
 * @param name
 */
const expandCollapseMainSection = (client, name) => {
  const id = `#${name.toLowerCase().replace(/\s/g, '-')}-accordion`;
  expandCollapseAccordion(client, id);
};

const displayLearnMoreModal = client => {
  client
    .waitForElementVisible('.learn-more-button', Timeouts.normal)
    .click('.learn-more-button')
    .axeCheck('.va-modal')
    .click('.va-modal-close');
};

const editEligibilityDetails = client => {
  client
    .waitForElementVisible('.eligibility-details', Timeouts.normal)
    .click('.eligibility-details button')
    .axeCheck('.eligibility-details');
};

const hideCalculatorFields = client => {
  expandCollapseAccordion(client, '.calculator-inputs');
};
const housingRate =
  '#gbct_housing_allowance > div.small-6.columns.vads-u-text-align--right > h5';

// Search for an institution with Ch33 Benefit, select In Person or Online radio, and click result
function searchCh33(client, inPersonOrOnlineRadio, search, result) {
  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);
  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .waitForElementPresent(inPersonOrOnlineRadio, Timeouts.normal)
    .click(inPersonOrOnlineRadio)
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', search)
    .click('#search-button')
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main')
    .waitForElementVisible(result, Timeouts.normal)
    .click('body')
    .click(result)
    .waitForElementVisible('body', 1000)
    .axeCheck('.main');
}
// Selects VA rate or DOD rate, Verifies Housing rate
function verifyCh33(client, expectedRateDOD, expectedRateVA, radioID) {
  client
    .waitForElementPresent(`#radio-buttons-${radioID}-0`, Timeouts.normal)
    .click(`#radio-buttons-${radioID}-0`)
    .waitForElementVisible(housingRate, Timeouts.normal)
    .assert.containsText(housingRate, expectedRateVA)
    .waitForElementPresent(`#radio-buttons-${radioID}-1`, Timeouts.normal)
    .click(`#radio-buttons-${radioID}-1`)
    .waitForElementVisible(housingRate, Timeouts.normal)
    .assert.containsText(housingRate, expectedRateDOD);
}

// Selects DEA as benefit type, searches for schools in washington dc, checks the housing rate of the expected result, and clicks the expected result
function searchAsDEA(client, expectedResult, resultRate, expectedRate) {
  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', '35')
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', 'washington dc')
    .click('#search-button')
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');
  client.expect.element(expectedResult).to.be.enabled.before(Timeouts.normal);
  client.assert
    .containsText(resultRate, expectedRate)
    .click(expectedResult)
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main');
}
// Verify the expected DEA housing rate for the selected "Enrolled" option
function verifyDEA(client, enrolledOption, expectedDEA) {
  client
    .selectDropdown('enrolledOld', enrolledOption)
    .waitForElementVisible(housingRate, Timeouts.normal)
    .assert.containsText(housingRate, expectedDEA);
}

function formatNumberHalf(value) {
  const halfVal = Math.round(value / 2);
  return formatCurrency(halfVal);
}

function formatCurrencyHalf(value) {
  return formatNumberHalf(Math.round(+value));
}

module.exports = {
  expectLocation,
  initApplicationMock,
  searchForInstitution,
  selectFirstSearchResult,
  expandCollapseAccordion,
  expandCollapseMainSection,
  displayLearnMoreModal,
  editEligibilityDetails,
  hideCalculatorFields,
  searchCh33,
  verifyCh33,
  searchAsDEA,
  verifyDEA,
  formatCurrencyHalf,
};
