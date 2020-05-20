const GiHelpers = require('./gibct-helpers');
const UtilHelpers = require('../../utils/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const vetTecProfile = require('../data/vet-tec-profile.json');
const vetTecSearchResults = require('../data/vet-tec-search-results.json');
const mock = require('platform/testing/e2e/mock-helpers');

// Create API routes
const initApplicationMock = (
  profile = vetTecProfile,
  results = vetTecSearchResults,
) => {
  mock(null, {
    path: '/v0/gi/institution_programs/search',
    verb: 'get',
    value: results,
  });

  GiHelpers.initMockProfile(profile);
  GiHelpers.initCommonMock();
};

const searchForVetTec = client => {
  client
    .selectRadio('category', 'vettec')
    .waitForElementVisible('#search-button', Timeouts.normal)
    .click('#search-button');
};

const verifySearchResults = (client, results = vetTecSearchResults) => {
  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');

  results.data.forEach(result => {
    const id = `#search-result-${result.attributes.facility_code}-${
      result.attributes.description
    }`;
    client.waitForElementVisible(UtilHelpers.createId(id), Timeouts.normal);
  });
};

module.exports = {
  initApplicationMock,
  searchForVetTec,
  verifySearchResults,
};
