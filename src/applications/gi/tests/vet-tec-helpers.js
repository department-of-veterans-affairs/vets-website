const Timeouts = require('../../../platform/testing/e2e/timeouts');
const vetTecProfile = require('./e2e/vet-tec-profile.json');
const vetTecSearchResults = require('./e2e/vet-tec-search-results.json');
const calculatorConstants = require('./e2e/calculator-constants.json');
const featureToggles = require('./e2e/feature-toggles.json');
const mock = require('../../../platform/testing/e2e/mock-helpers');

const vetTecAttributes = vetTecProfile.data.attributes;

// Create API routes
const initApplicationMock = () => {
  mock(null, {
    path: '/v0/gi/institution_programs/search',
    verb: 'get',
    value: vetTecSearchResults,
  });

  mock(null, {
    path: `/v0/gi/institutions/${vetTecAttributes.facility_code}`,
    verb: 'get',
    value: vetTecProfile,
  });

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

const searchForVetTec = client => {
  client
    .selectRadio('category', 'vettec')
    .waitForElementVisible('#search-button', Timeouts.normal)
    .click('#search-button');
};

module.exports = {
  initApplicationMock,
  searchForVetTec,
};
