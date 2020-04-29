const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Mock = require('platform/testing/e2e/mock-helpers');
const SuccessMockData = require('../mockdata/200-response.json');
const Timeouts = require('platform/testing/e2e/timeouts');

function runRatedDisabilitiesTest(browser) {
  browser.assert.containsText(
    'h2.vads-u-margin-y--1p5',
    'Your individual ratings',
  );
  // This is checking for the top level <dl> tag in RatedDisabilityListItem
  browser.assert.visible(
    '.vads-u-display--block.vads-l-col--12.vads-u-background-color--gray-lightest.vads-u-margin-top--0.vads-u-margin-bottom--2.vads-u-padding-top--1.vads-u-padding-bottom--2.vads-u-padding-x--2',
  );
  // This is check for the first instance of a rated disability name
  browser.assert.elementPresent(
    '.vads-u-display--block.vads-u-font-size--h3.vads-u-font-weight--bold.vads-u-margin--0',
  );
}

function generateData(token) {
  return Mock(token, SuccessMockData);
}

function begin(browser) {
  browser.perform(done => {
    const token = Auth.getUserToken();
    generateData(token).then(() => {
      Auth.logIn(
        token,
        browser,
        '/disability/view-disability-rating/rating',
        3,
      ).waitForElementVisible('h2.vads-u-margin-y--1p5', Timeouts.verySlow);
    });
    browser.pause(Timeouts.slow);
    runRatedDisabilitiesTest(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
