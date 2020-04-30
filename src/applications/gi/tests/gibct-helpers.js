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

const eybSections = {
  yourBenefits: 'Your benefits',
  aboutYourSchool: 'About your school',
  learningFormatAndSchedule: 'Learning format and schedule',
  scholarshipsAndOtherFunding: 'Scholarships and other funding',
};

const eybAccordionExpandedCheck = (client, section) => {
  checkAccordionIsExpanded(client, section);
  Object.values(eybSections)
    .filter(value => value !== section)
    .forEach(value => checkAccordionIsNotExpanded(client, value));
};

/**
 * This is expanded by default
 * @param client
 */
const yourBenefits = client => {
  const id = createAccordionId(eybSections.yourBenefits);

  client.waitForElementVisible(id, Timeouts.normal).axeCheck(id);
  eybAccordionExpandedCheck(client, eybSections.yourBenefits);
};

const aboutYourSchool = client => {
  clickAccordion(client, eybSections.aboutYourSchool);
  eybAccordionExpandedCheck(client, eybSections.aboutYourSchool);
};

const learningFormatAndSchedule = client => {
  clickAccordion(client, eybSections.learningFormatAndSchedule);
  eybAccordionExpandedCheck(client, eybSections.learningFormatAndSchedule);
};

const scholarshipsAndOtherFunding = client => {
  clickAccordion(client, eybSections.scholarshipsAndOtherFunding);
  eybAccordionExpandedCheck(client, eybSections.scholarshipsAndOtherFunding);
};

module.exports = {
  expectLocation,
  initApplicationMock,
  searchForInstitution,
  selectSearchResult,
  createId,
  expandCollapseAccordion,
  displayLearnMoreModal,
  yourBenefits,
  aboutYourSchool,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
