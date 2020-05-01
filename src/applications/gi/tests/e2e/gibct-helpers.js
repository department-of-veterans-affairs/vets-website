const UtilHelpers = require('../../utils/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const autocomplete = require('../data/autocomplete.json');
const institutionProfile = require('../data/institution-profile.json');
const searchResults = require('../data/search-results.json');
const calculatorConstants = require('../data/calculator-constants.json');
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
    value: calculatorConstants,
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

  results.data.forEach(result => {
    const id = `#search-result-${result.attributes.facility_code}`;
    client.waitForElementVisible(id, Timeouts.normal);
  });
};

const selectSearchResult = (client, facilityCode) => {
  client
    .waitForElementVisible(`#search-result-${facilityCode}`, Timeouts.normal)
    .click(`#search-result-${facilityCode} a`);
};

const createId = name => name.toLowerCase().replace(/\s/g, '-');
const createAccordionId = name => `#${createId(name)}-accordion`;

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
  client.assert.attributeEquals(
    `${createAccordionId(name)} button`,
    'aria-expanded',
    'true',
  );
};

const checkAccordionIsNotExpanded = (client, name) => {
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
const expandCollapseAccordion = (client, name) => {
  clickAccordion(client, name);
  clickAccordion(client, name);
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

const calculatorConstantsList = () => {
  const constantsList = [];
  calculatorConstants.data.forEach(c => {
    constantsList[c.attributes.name] = c.attributes.value;
  });
  return constantsList;
};

const eybSections = {
  yourBenefits: 'Your benefits',
  aboutYourSchool: 'About your school',
  learningFormatAndSchedule: 'Learning format and schedule',
  scholarshipsAndOtherFunding: 'Scholarships and other funding',
};

/**
 * This is expanded by default
 * @param client
 * @param sections defaults to all sections, allows for passing in a smaller set of sections
 */
const yourBenefits = (client, sections = eybSections) => {
  const id = createAccordionId(sections.yourBenefits);

  client.waitForElementVisible(id, Timeouts.normal).axeCheck(id);
  eybAccordionExpandedCheck(client, sections, sections.yourBenefits);
};

const aboutYourSchool = (client, sections = eybSections) => {
  clickAccordion(client, sections.aboutYourSchool);
  eybAccordionExpandedCheck(client, sections, sections.aboutYourSchool);
};

const learningFormatAndSchedule = (client, sections = eybSections) => {
  clickAccordion(client, sections.learningFormatAndSchedule);
  eybAccordionExpandedCheck(
    client,
    sections,
    sections.learningFormatAndSchedule,
  );
};

const scholarshipsAndOtherFunding = (client, sections = eybSections) => {
  clickAccordion(client, sections.scholarshipsAndOtherFunding);
  eybAccordionExpandedCheck(
    client,
    sections,
    sections.scholarshipsAndOtherFunding,
  );
};

module.exports = {
  initCommonMock,
  initMockProfile,
  expectLocation,
  initApplicationMock,
  searchForInstitution,
  verifySearchResults,
  selectSearchResult,
  createId,
  createAccordionId,
  clickAccordion,
  checkAccordionIsExpanded,
  checkAccordionIsNotExpanded,
  expandCollapseAccordion,
  displayLearnMoreModal,
  eybAccordionExpandedCheck,
  formatNumber,
  formatCurrency,
  formatCurrencyHalf,
  calculatorConstantsList,
  yourBenefits,
  aboutYourSchool,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
