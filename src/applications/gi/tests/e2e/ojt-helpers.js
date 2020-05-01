const GiHelpers = require('./gibct-helpers');
const autocomplete = require('../data/autocomplete.json');
const ojtProfile = require('../data/ojt-profile.json');
const ojtSearchResults = require('../data/ojt-search-results.json');
const calculatorConstants = require('../data/calculator-constants.json');
const featureToggles = require('../data/feature-toggles.json');
const mock = require('platform/testing/e2e/mock-helpers');

const ojtAttributes = ojtProfile.data.attributes;

// Create API routes
const initApplicationMock = () => {
  mock(null, {
    path: '/v0/gi/institutions/search',
    verb: 'get',
    value: ojtSearchResults,
  });

  mock(null, {
    path: `/v0/gi/institutions/${ojtAttributes.facility_code}`,
    verb: 'get',
    value: ojtProfile,
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

const selectOJTType = client => {
  client.selectRadio('category', 'employer');
  client.axeCheck('.main');
};

const eybSections = {
  yourBenefits: 'Your benefits',
  learningFormatAndSchedule: 'Learning format and schedule',
  scholarshipsAndOtherFunding: 'Scholarships and other funding',
};

/**
 * This is expanded by default
 * @param client
 */
const yourBenefits = client => {
  GiHelpers.yourBenefits(client, eybSections);
};

const learningFormatAndSchedule = client => {
  GiHelpers.learningFormatAndSchedule(client, eybSections);
};

const scholarshipsAndOtherFunding = client => {
  GiHelpers.scholarshipsAndOtherFunding(client, eybSections);
};

module.exports = {
  initApplicationMock,
  selectOJTType,
  yourBenefits,
  learningFormatAndSchedule,
  scholarshipsAndOtherFunding,
};
