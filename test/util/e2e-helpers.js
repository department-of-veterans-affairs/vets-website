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

function expectValueToBeBlank(client, field) {
  client.expect.element(field).to.have.value.that.equals('');
}

function expectInputToNotBeSelected(client, field) {
  client.expect.element(field).to.not.be.selected;
}

function overrideVetsGovApi(client) {
  client.execute((url) => {
    window.VetsGov.api.url = url;
    return window.VetsGov.api.url;
  },
  [`http://localhost:${process.env.API_PORT || 4000}`],
  (val) => {
    // eslint-disable-next-line no-console
    console.log(`Result of overriding VetsGov.api.url${JSON.stringify(val)}`);
  });
}

module.exports = {
  baseUrl: `http://localhost:${process.env.WEB_PORT || 3333}`,
  apiUrl: `http://localhost:${process.env.API_PORT || 4000}`,
  createE2eTest,
  expectNavigateAwayFrom,
  expectValueToBeBlank,
  expectInputToNotBeSelected,
  overrideVetsGovApi,
};
