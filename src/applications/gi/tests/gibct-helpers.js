const Timeouts = require('../../../platform/testing/e2e/timeouts');
const autocomplete = require('./data/autocomplete.json');
const institutionProfile = require('./data/institution-profile.json');
const searchResults = require('./data/search-results.json');
const calculatorConstants = require('./data/calculator-constants.json');
const featureToggles = require('./data/feature-toggles.json');
const mock = require('../../../platform/testing/e2e/mock-helpers');

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

const selectSearchResult = (client, facilityCode) => {
  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main')
    .waitForElementVisible(`#search-result-${facilityCode}`, Timeouts.normal)
    .click(`#search-result-${facilityCode} a`);
};

const createId = name => name.toLowerCase().replace(/\s/g, '-');

/**
 * Expand or collapse an AccordionItem and perform axe check
 * @param client
 * @param name button property of the AccordionItem
 */
const clickAccordion = (client, name) => {
  const id = `#${createId(name)}-accordion`;
  client
    .waitForElementVisible(id, Timeouts.normal)
    .click(`${id} button`)
    .axeCheck(id);
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

const yourBenefits = client => {
  const name = 'Your benefits';
  const id = `#${createId(name)}-accordion`;

  client
    .waitForElementVisible(id, Timeouts.normal)
    .axeCheck('.eligibility-details');
};

const aboutYourSchool = client => {
  const name = 'About your school';
  clickAccordion(client, name);
};

const learningFormatAndSchedule = client => {
  const name = 'Learning format and schedule';
  clickAccordion(client, name);
};

const scholarshipsAndOtherFunding = client => {
  const name = 'Scholarships and other funding';
  clickAccordion(client, name);
};

module.exports = {
  expectLocation,
  initApplicationMock,
  searchForInstitution,
  selectSearchResult,
  expandCollapseAccordion,
  displayLearnMoreModal,
  yourBenefits,
  aboutYourSchool,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
