// Node modules.
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
// Relative imports.
import E2eHelpers from 'platform/testing/e2e/helpers';
import Timeouts from 'platform/testing/e2e/timeouts.js';
import createMockEndpoint from 'platform/testing/e2e/mock-helpers';
import stub from './constants/stub.json';

const SELECTORS = {
  APP: '[data-e2e-id="yellow-ribbon-app"]',
  NEXT_PAGE: '.va-pagination-next > a',
  SEARCH_FORM: '[data-e2e-id="search-form"]',
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
  browser.selectDropdown(`${SELECTORS.SEARCH_FORM} select`, 'TX');
  browser.setValue(
    `${SELECTORS.SEARCH_FORM} input[name="yr-search-city"]`,
    'Austin',
  );
  browser.click(`${SELECTORS.SEARCH_FORM} button[type="submit"]`);

  // A11y check the search results.
  browser.waitForElementVisible(
    `${SELECTORS.SEARCH_RESULT_TITLE}`,
    Timeouts.slow,
  );
  browser.axeCheck(SELECTORS.APP);

  stub.data.forEach(yellowRibbonProgram => {
    browser.assert.containsText(
      startCase(toLower(yellowRibbonProgram.attributes.nameOfInstitution)),
    );
  });

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
