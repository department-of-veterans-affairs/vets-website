const fs = require('fs');
const path = require('path');

const E2eHelpers = require('platform/testing/e2e/helpers');

function verifyGoogleAnalytics(browser) {
  const googleAnalyticsCode = fs.readFileSync(
    path.join(
      __dirname,
      '../../assets/js/google-analytics/',
      `${process.env.BUILDTYPE}.js`,
    ),
  );

  browser.execute(
    () => document.querySelector('[data-e2e="analytics-script"]').innerHTML,
    [],
    ({ value: analyticsScriptHtml }) => {
      const codeExists = analyticsScriptHtml.includes(googleAnalyticsCode);
      browser.assert.equal(
        codeExists,
        true,
        'Google Analytics code exists in the DOM.',
      );
    },
  );
}

function verifyElementCount(browser, selector, expectedNumElements, message) {
  browser.execute(
    data => Array.from(document.querySelectorAll(data)).length,
    [selector],
    ({ value: numElements }) => {
      browser.assert.equal(numElements, expectedNumElements, message);
    },
  );
}

function main(browser) {
  browser.openUrl(`${E2eHelpers.baseUrl}/`);
  browser.axeCheck('main');

  verifyElementCount(browser, '[data-e2e="bucket"]', 4, 'There are 4 buckets');
  verifyElementCount(browser, '[data-e2e="hub"]', 11, 'There are 11 hubs');
  verifyElementCount(
    browser,
    '[data-e2e="news"]',
    3,
    'There are 3 news stories',
  );
  verifyGoogleAnalytics(browser);
}

module.exports = E2eHelpers.createE2eTest(main);
