import Timeouts from './timeouts';

// Returns an object suitable for a nightwatch test case.
//
// Provides test framework maintainers a single entry point for annotating all tests with things
// like uniform reporters.
//
// @param {beginApplication} Callable taking one argument, client, that runs the e2e test.
function createE2eTest(beginApplication) {
  return { 'Begin application': beginApplication };
}

// Expects navigation lands at a path with the given `urlSubstring`.
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain(urlSubstring).before(Timeouts.normal);
}

function overrideVetsGovApi(client) {
  client.execute(() => {
    window.VetsGov.api.url = 'http://localhost:4000';
    return window.VetsGov.api.url;
  },
  [],
  (val) => {
    // eslint-disable-next-line no-console
    console.log(`Result of overriding VetsGov.api.url${JSON.stringify(val)}`);
  });
}

module.exports = {
  baseUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:4000',
  createE2eTest,
  expectNavigateAwayFrom,
  overrideVetsGovApi,
};
