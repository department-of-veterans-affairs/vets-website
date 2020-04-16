// Node modules.
import toLower from 'lodash/toLower';
// Relative imports.
import E2eHelpers from 'platform/testing/e2e/helpers';
import Timeouts from 'platform/testing/e2e/timeouts.js';
import createMockEndpoint from 'platform/testing/e2e/mock-helpers';
import stub from './constants/stub.json';
import {
  deriveDegreeLevel,
  deriveDivisionProfessionalSchool,
  deriveEligibleStudentsLabel,
  deriveLocationLabel,
  deriveMaxAmountLabel,
  deriveNameLabel,
} from './components/SearchResult';

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
  browser.waitForElementVisible(SELECTORS.SEARCH_RESULT_TITLE, Timeouts.slow);
  browser.axeCheck(SELECTORS.APP);

  // Check each search result to make sure it has the data we need to show.
  stub.data.forEach(yellowRibbonProgram => {
    // Check Institution name.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      deriveNameLabel(yellowRibbonProgram.attributes),
    );

    // Check location.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      deriveLocationLabel(yellowRibbonProgram.attributes),
    );

    // Check contribution amount.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      deriveMaxAmountLabel(yellowRibbonProgram.attributes),
    );

    // Check eligible students.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      deriveEligibleStudentsLabel(yellowRibbonProgram.attributes),
    );

    // Check degree level.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      deriveDegreeLevel(yellowRibbonProgram.attributes),
    );

    // Check profession/program.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      deriveDivisionProfessionalSchool(yellowRibbonProgram.attributes),
    );

    // Check website link.
    browser.assert.containsText(
      SELECTORS.SEARCH_RESULTS,
      toLower(yellowRibbonProgram.attributes.insturl) || 'Not provided',
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
