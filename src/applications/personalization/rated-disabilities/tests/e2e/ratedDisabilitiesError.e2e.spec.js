const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const ErrorMockData = require('../mockdata/error-response.json');
const manifest = require('../../manifest.json');
const Mock = require('platform/testing/e2e/mock-helpers');
const Timeouts = require('platform/testing/e2e/timeouts');

function runRatedDisabilitiesTest(browser) {
  browser.assert.containsText(
    '.usa-alert-heading',
    'No disability rating found',
  );
  browser.assert.visible('.usa-alert-text');
  browser.assert.containsText(
    '.usa-alert-text p:nth-of-type(1)',
    "We are sorry. We can't find a disability rating matched with the name, date of birth, and social secuity number you provided in our Veteran records.",
  );
}

function generateErrorData(token) {
  return Mock(token, ErrorMockData);
}

function begin(browser) {
  browser.perform(done => {
    const token = Auth.getUserToken();
    generateErrorData(token).then(() => {
      Auth.logIn(
        token,
        browser,
        '/disability/check-disability-rating/rating',
        3,
      ).waitForElementVisible('.usa-alert-heading', Timeouts.verySlow);
    });
    browser.pause(Timeouts.slow);
    runRatedDisabilitiesTest(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
