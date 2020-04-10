const Timeouts = require('platform/testing/e2e/timeouts.js');
const autocomplete = require('./e2e/autocomplete.json');
const institutionProfile = require('./e2e/institution-profile.json');
const searchResults = require('./e2e/search-results.json');
const calculatorConstants = require('./e2e/calculator-constants.json');

// Expects navigation lands at a path with the given `urlSubstring`.
const expectLocation = (client, urlSubstring) => {
  client.expect
    .url()
    .to.contain(urlSubstring)
    .before(Timeouts.slow);
};

const mock = require('../../../platform/testing/e2e/mock-helpers');

// Create API routes
function initApplicationMock() {
  mock(null, {
    path: '/v0/gi/institutions/search',
    verb: 'get',
    value: searchResults,
  });

  mock(null, {
    path: '/v0/gi/institutions/14000109',
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
    value: {
      data: {
        features: [],
      },
    },
  });

  mock(null, {
    path: '/v0/maintenance_windows',
    verb: 'get',
    value: {},
  });
}

module.exports = {
  initApplicationMock,
  expectLocation,
};
