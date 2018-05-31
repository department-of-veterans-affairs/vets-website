const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
const createMockEndpoint = require('../../../../../platform/testing/e2e/mock-helpers');
const Auth = require('../../../../../platform/testing/e2e/auth');
const routes = require('./routes.json');

let token = null;

async function createMockRoutes() {
  /* eslint-disable no-await-in-loop */
  for (const route of routes) {
    await createMockEndpoint(token, route);
  }
}

function begin(browser) {
  browser.perform(async done => {
    token = Auth.getUserToken();
    await createMockRoutes();
    Auth.logIn(token, browser, '/profile', 3)
      .waitForElementVisible('.va-profile-wrapper', Timeouts.slow)
      .axeCheck('document');
    // E2eHelpers.overrideSmoothScrolling(browser);
    // browser.waitForElementVisible('body', Timeouts.normal);
    browser.pause(10000, done);
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
