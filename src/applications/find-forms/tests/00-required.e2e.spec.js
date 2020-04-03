const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const createMockEndpoint = require('../../../platform/testing/e2e/mock-helpers');

import sortBy from 'lodash/sortBy';
import chunk from 'lodash/chunk';

const stub = require('../constants/stub.json');

const SELECTORS = {
  WIDGET: '[data-widget-type="find-va-forms"]',
  SEARCH_FORM: '[data-e2e-id="find-form-search-form"]',
  SEARCH_RESULT_TITLE: '[data-e2e-id="result-title"]',
  NEXT_PAGE: '.va-pagination-next > a',
};

function runTest(browser) {
  browser.openUrl(`${E2eHelpers.baseUrl}/find-forms/`);

  E2eHelpers.overrideSmoothScrolling(browser);

  browser
    .waitForElementVisible('body', Timeouts.slow)
    .waitForElementVisible(SELECTORS.SEARCH_FORM, Timeouts.slow)
    .axeCheck(SELECTORS.WIDGET);

  browser.setValue(`${SELECTORS.SEARCH_FORM} input`, 'health');
  browser.click(`${SELECTORS.SEARCH_FORM} button[type="submit"]`);

  browser.waitForElementVisible(
    `${SELECTORS.SEARCH_RESULT_TITLE}`,
    Timeouts.slow,
  );
  browser.axeCheck(SELECTORS.WIDGET);

  const sortedForms = sortBy(stub.data, 'id');
  const pageLength = 10;
  const pages = chunk(sortedForms, pageLength);

  pages.forEach((page, pageNumber) => {
    page.forEach(form => {
      browser.assert.elementPresent(`a[href="${form.attributes.url}"]`);
    });

    const nextPage = pageNumber + 1;
    const hasNextPage = nextPage < pages.length;

    if (hasNextPage) {
      browser.click(SELECTORS.NEXT_PAGE);
    }
  });

  browser.end();
}

function setup() {
  return createMockEndpoint('', {
    path: '/v0/forms',
    verb: 'get',
    value: stub,
  });
}

module.exports = E2eHelpers.createE2eTest(browser => {
  browser.perform(done => {
    setup().then(() => {
      runTest(browser);
      done();
    });
  });
});
