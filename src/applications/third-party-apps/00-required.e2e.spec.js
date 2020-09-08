// Relative imports.
import E2eHelpers from 'platform/testing/e2e/helpers';
import Timeouts from 'platform/testing/e2e/timeouts';
import createMockEndpoint from 'platform/testing/e2e/mock-helpers';
import manifest from './manifest.json';
import stub from './api/stub.js';
import environments from 'site/constants/environments';

const SELECTORS = {
  APP: '[data-e2e-id="app"]',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
  SEARCH_RESULTS: '[data-e2e-id="search-results"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
};

const runTest = browser => {
  // Open the URL.
  browser.openUrl(`${E2eHelpers.baseUrl}/third-party-applications/`);

  // Stop smooth scrolling.
  E2eHelpers.overrideSmoothScrolling(browser);

  // A11y check the search form.
  browser
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible(SELECTORS.SEARCH_FORM, Timeouts.slow)
    .axeCheck(SELECTORS.APP);

  // Fill out and submit the form.
  browser.click(
    `${
      SELECTORS.SEARCH_FORM
    } select[name="platform-field"] option[value="iOS"]`,
  );
  browser.click(
    `${
      SELECTORS.SEARCH_FORM
    } select[name="category-field"] option[value="Health"]`,
  );
  browser.click(`${SELECTORS.SEARCH_FORM} button[type="submit"]`);

  // A11y check the search results.
  browser
    .waitForElementVisible(SELECTORS.SEARCH_RESULT_TITLE, Timeouts.slow)
    .axeCheck(SELECTORS.APP);

  // Check results.
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, 'Apple Health');
  browser.assert.containsText(SELECTORS.SEARCH_RESULTS, 'Find app');
  browser.assert.containsText(
    SELECTORS.SEARCH_RESULTS,
    'Health app available for iOS',
  );
  browser.assert.containsText(
    SELECTORS.SEARCH_RESULTS,
    'Learn about Apple Health',
  );

  browser.end();
};

const setup = () =>
  createMockEndpoint('', {
    path: '/third-party-applications',
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
