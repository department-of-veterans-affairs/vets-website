const E2eHelpers = require('platform/testing/e2e/helpers');
const UtilHelpers = require('../../utils/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const autocomplete = require('../data/autocomplete.json');
const institutionProfile = require('../data/institution-profile.json');
const searchResults = require('../data/search-results.json');
const calculatorConstantsJson = require('../data/calculator-constants.json');
const featureToggles = require('../data/feature-toggles.json');
const mock = require('platform/testing/e2e/mock-helpers');

/**
 * Expects navigation lands at a path containing the given `urlSubstring`.
 * @param client
 * @param urlSubstring
 */
const expectLocation = (client, urlSubstring) => {
  client.assert.urlContains(urlSubstring);
};

/**
 * These calls are common regardless of path through CT
 */
const initCommonMock = () => {
  mock(null, {
    path: '/v0/gi/calculator_constants',
    verb: 'get',
    value: calculatorConstantsJson,
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

/**
 * Mocks the call for the profile
 * @param profile
 */
const initMockProfile = profile => {
  const facilityCode = profile.data.attributes.facility_code;

  mock(null, {
    path: `/v0/gi/institutions/${facilityCode}`,
    verb: 'get',
    value: profile,
  });
};

// Create API routes
const initApplicationMock = (
  profile = institutionProfile,
  results = searchResults,
) => {
  mock(null, {
    path: '/v0/gi/institutions/autocomplete',
    verb: 'get',
    value: autocomplete,
  });

  mock(null, {
    path: '/v0/gi/institutions/search',
    verb: 'get',
    value: results,
  });

  initMockProfile(profile);
  initCommonMock();
};

/**
 * Select option for "Which GI Bill benefit do you want to use?"
 * @param client
 * @param option
 */
const giBillChapter = (client, option) => {
  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', option)
    .axeCheck('.main');
};

const searchForInstitution = (client, name) => {
  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', name)
    .click('#search-button');
};

const verifySearchResults = (client, results = searchResults) => {
  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');
  expectLocation(client, `/search`);

  results.data.forEach(({ attributes: profile }) => {
    const id = `#search-result-${profile.facility_code}`;
    client.waitForElementVisible(id, Timeouts.normal);
  });
};

const selectSearchResult = (client, facilityCode, checkLocation = true) => {
  client
    .waitForElementVisible(`#search-result-${facilityCode}`, Timeouts.normal)
    .click(`#search-result-${facilityCode} a`)
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main');
  if (checkLocation) expectLocation(client, `/profile/${facilityCode}`);
};

const createAccordionId = name => `#${UtilHelpers.createId(name)}-accordion`;

/**
 * Expand or collapse an AccordionItem and perform axe check
 * @param client
 * @param name button property of the AccordionItem
 */
const clickAccordion = (client, name) => {
  const id = createAccordionId(name);
  client
    .waitForElementVisible(id, Timeouts.normal)
    .click(`${id} button`)
    .axeCheck(id);
};

const checkAccordionIsExpanded = (client, name) => {
  client.waitForElementVisible(
    `${createAccordionId(name)} button`,
    Timeouts.normal,
  );

  client.assert.attributeEquals(
    `${createAccordionId(name)} button`,
    'aria-expanded',
    'true',
  );
};

const checkAccordionIsNotExpanded = (client, name) => {
  client.waitForElementVisible(
    `${createAccordionId(name)} button`,
    Timeouts.normal,
  );
  client.assert.attributeEquals(
    `${createAccordionId(name)} button`,
    'aria-expanded',
    'false',
  );
};

/**
 * Main sections are expanded on page load,
 * this collapses then expands an AccordionItem
 * @param client
 * @param name button property of the AccordionItem
 */
const collapseExpandAccordion = (client, name) => {
  clickAccordion(client, name);
  checkAccordionIsNotExpanded(client, name);
  clickAccordion(client, name);
  checkAccordionIsExpanded(client, name);
};

const displayLearnMoreModal = client => {
  client
    .waitForElementVisible('.learn-more-button', Timeouts.normal)
    .click('.learn-more-button')
    .axeCheck('.va-modal')
    .click('.va-modal-close');
};

const eybAccordionExpandedCheck = (client, sections, section) => {
  checkAccordionIsExpanded(client, section);
  Object.values(sections)
    .filter(value => value !== section)
    .forEach(value => checkAccordionIsNotExpanded(client, value));
};

const formatNumber = value => {
  const str = (+value).toString();
  return `${str.replace(/\d(?=(\d{3})+$)/g, '$&,')}`;
};

const formatCurrency = value => `$${formatNumber(Math.round(+value))}`;

const formatNumberHalf = value => {
  const halfVal = Math.round(value / 2);
  return UtilHelpers.formatCurrency(halfVal);
};

const formatCurrencyHalf = value => formatNumberHalf(Math.round(+value));

const createCalculatorConstants = () => {
  const constantsList = [];
  calculatorConstantsJson.data.forEach(c => {
    constantsList[c.attributes.name] = c.attributes.value;
  });
  return constantsList;
};
const calculatorConstants = createCalculatorConstants();

const eybSections = {
  yourMilitaryDetails: 'Your military details',
  schoolCostsAndCalendar: 'School costs and calendar',
  learningFormat: 'Learning format and location',
  scholarshipsAndOtherVAFunding: 'Scholarships and other VA funding',
};

/**
 * Click the Calculate Benefits button
 * @param client
 */
const calculateBenefits = client => {
  client
    .waitForElementVisible('.calculate-button', Timeouts.normal)
    .click('.calculate-button')
    .pause(1000);
};

/**
 * Verifies Housing Rate on Desktop
 * @param client
 * @param housingRate
 */
const checkProfileHousingRate = (client, housingRate) => {
  const housingRateId = `#calculator-result-row-${UtilHelpers.createId(
    'Housing allowance',
  )} h5`;

  client
    .waitForElementVisible(housingRateId, Timeouts.normal)
    .assert.containsText(housingRateId, formatCurrency(housingRate));
};

/**
 * Verifies Housing Rate after selecting an option for "Enrolled"
 * Used if selected GI Bill benefit is ch30 or 1606 or ch35
 * Or if 31 is selected and No is answered to "Are you eligible for the Post-9/11 GI Bill?"
 * @param client
 * @param option
 * @param housingRate
 */
const enrolledOld = (client, option, housingRate) => {
  client.selectDropdown('enrolledOld', option);
  calculateBenefits(client);
  checkProfileHousingRate(client, housingRate);
};

/**
 * Opens section and performs generic checks
 * Should NOT include question checks
 * @param client
 * @param clickToOpen
 * @param sectionName
 * @param sections
 */
const checkSectionAccordion = (
  client,
  clickToOpen,
  sectionName,
  sections = eybSections,
) => {
  if (clickToOpen) {
    clickAccordion(client, sections[sectionName]);
  } else {
    const id = createAccordionId(sections[sectionName]);
    client.waitForElementVisible(id, Timeouts.normal).axeCheck(id);
  }
  eybAccordionExpandedCheck(client, sections, sections[sectionName]);
};

const breadCrumb = (client, breadCrumbHref) => {
  const id = `.va-nav-breadcrumbs a[href='${breadCrumbHref}']`;
  client.waitForElementVisible(id, Timeouts.normal).click(id);
  client.assert.urlEquals(`${E2eHelpers.baseUrl}${breadCrumbHref}`);
};

module.exports = {
  initCommonMock,
  initMockProfile,
  expectLocation,
  initApplicationMock,
  giBillChapter,
  searchForInstitution,
  verifySearchResults,
  selectSearchResult,
  createAccordionId,
  clickAccordion,
  checkAccordionIsExpanded,
  checkAccordionIsNotExpanded,
  collapseExpandAccordion,
  displayLearnMoreModal,
  eybAccordionExpandedCheck,
  formatNumber,
  formatCurrency,
  formatCurrencyHalf,
  calculatorConstants,
  calculateBenefits,
  checkProfileHousingRate,
  enrolledOld,
  breadCrumb,
  checkSectionAccordion,
};
