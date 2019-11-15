const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const manifest = require('../../manifest.json');
const Mock = require('platform/testing/e2e/mock-helpers');
const SuccessMockData = require('../mockdata/200-response.json');
const Timeouts = require('platform/testing/e2e/timeouts');

function runRatedDisabilitiesTest(browser) {
  browser.assert.containsText(
    '.vads-u-font-family--sans.vads-u-margin-y--1',
    'Individual disability ratings',
  );
  browser.assert.visible(
    '.vads-u-font-weight--bold.vads-u-margin-top--0p25.vads-u-margin-bottom--0.vads-u-margin-x--0.vads-u-font-size--base',
  );
  browser.assert.containsText(
    'p.vads-u-font-weight--bold.vads-u-margin-top--0p25.vads-u-margin-bottom--0.vads-u-margin-x--0.vads-u-font-size--base:nth-of-type(1)',
    'Diabetes mellitus0',
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
        '/disability/check-disability-rating/rating',
        3,
      ).waitForElementVisible(
        '.vads-u-font-family--sans.vads-u-margin-y--1',
        Timeouts.verySlow,
      );
    });
    browser.pause(Timeouts.slow);
    runRatedDisabilitiesTest(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
