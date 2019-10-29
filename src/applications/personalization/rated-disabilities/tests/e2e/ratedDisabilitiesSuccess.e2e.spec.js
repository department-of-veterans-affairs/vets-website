const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../../manifest.json');
const Mock = require('platform/testing/e2e/mock-helpers');
const SuccessMockData = require('../mockdata/200-response.json');
const Timeouts = require('platform/testing/e2e/timeouts');

function runRatedDisabilitiesTest(browser) {
  browser.assert.containsText(
    '.vads-u-font-size--h3',
    'Your rated disabilities',
  );
  browser.assert.visible('.va-sortable-table');
  browser.assert.containsText('td:nth-of-type(1)', 'Diabetes mellitus0');
}

function generateTableData(token) {
  return Mock(token, SuccessMockData);
}

function begin(browser) {
  browser.perform(done => {
    const token = Auth.getUserToken();
    generateTableData(token).then(() => {
      Auth.logIn(
        token,
        browser,
        '/disability/check-disability-rating/rating',
        3,
      ).waitForElementVisible('.vads-u-font-size--h3', Timeouts.verySlow);
    });
    browser.pause(Timeouts.slow);
    runRatedDisabilitiesTest(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
