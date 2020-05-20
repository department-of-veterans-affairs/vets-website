// Relative imports.
import E2eHelpers from 'platform/testing/e2e/helpers';
import Timeouts from 'platform/testing/e2e/timeouts';
import createMockEndpoint from 'platform/testing/e2e/mock-helpers';
import manifest from './manifest.json';
import stub from './constants/stub.json';
import environments from 'site/constants/environments';

const SELECTORS = {
  APP: '[data-e2e-id="yellow-ribbon-app"]',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
};

const runTest = browser => {
  // Open the URL.
  browser.openUrl(
    `${E2eHelpers.baseUrl}/education/yellow-ribbon-participating-schools/`,
  );

  // Stop smooth scrolling.
  E2eHelpers.overrideSmoothScrolling(browser);

  // A11y check the search form.
  browser
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible(SELECTORS.SEARCH_FORM, Timeouts.slow)
    .axeCheck(SELECTORS.APP);

  // Fill out and submit the form.
  browser.setValue(
    `${SELECTORS.SEARCH_FORM} input[name="yr-search-name"]`,
    'university',
  );
  browser.click(`${SELECTORS.SEARCH_FORM} select option[value="TX"]`);
  browser.setValue(
    `${SELECTORS.SEARCH_FORM} input[name="yr-search-city"]`,
    'Austin',
  );
  browser.click(`${SELECTORS.SEARCH_FORM} button[type="submit"]`);

  // A11y check the search results.
  browser
    .waitForElementVisible(SELECTORS.SEARCH_RESULT_TITLE, Timeouts.slow)
    .axeCheck(SELECTORS.APP);

  // Check Institution name.
  browser.assert.containsText(
    SELECTORS.SEARCH_RESULTS,
    'Concordia University Texas',
  );

  // Check location.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, 'Austin, TX');

  // Check contribution amount.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, '$8,500');

  // Check eligible students.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, '250 students');

  // Check degree level.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, 'Undergraduate');

  // Check profession/program.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, 'Flex Program');

  // Check website link.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, 'www.phoenix.edu');

  browser.end();
};

const setup = () =>
  createMockEndpoint('', {
    path: '/v0/gi/yellow_ribbon_programs',
    verb: 'get',
    value: stub,
  });

module.exports = E2eHelpers.createE2eTest(browser => {
  browser.perform(done => {
    setup().then(() => {
      runTest(browser);
      done();
    });
  });
});

// TODO: Remove this when CI builds temporary landing pages to run e2e tests
module.exports['@disabled'] =
  manifest.e2eTestsDisabled && process.env.BUILDTYPE !== environments.LOCALHOST;
