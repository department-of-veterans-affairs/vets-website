const Timeouts = require('platform/testing/e2e/timeouts');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../manifest.json');

module.exports = E2eHelpers.createE2eTest(browser => {
  browser
    .url(`${E2eHelpers.baseUrl}/covid19screen`)
    .waitForElementVisible('body', Timeouts.normal)
    .axeCheck('.main');

  const incompleteClass = 'covid-screener-results-incomplete';

  browser.expect.element(`div.${incompleteClass}`).to.be.visible;

  browser.end();
});
