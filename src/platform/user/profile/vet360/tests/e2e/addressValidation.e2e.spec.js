const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const createMockEndpoint = require('platform/testing/e2e/mock-helpers');
const Auth = require('platform/testing/e2e/auth');
const routes = require('./routes.json');

function beginTests(browser) {
  return browser.pause(5600000);
}

function createMockRoutes(token) {
  const promises = [];
  for (const route of routes) {
    promises.push(createMockEndpoint(token, route));
  }
  return Promise.all(promises);
}

function begin(browser) {
  browser.perform(done => {
    const token = Auth.getUserToken();

    createMockRoutes(token).then(() => {
      // Login to access the Profile
      Auth.logIn(token, browser, '/profile', 3).waitForElementVisible(
        '.va-profile-wrapper',
        Timeouts.slow,
      );

      E2eHelpers.overrideSmoothScrolling(browser);

      // There's so much data loading async that it's easiest to just do a slow timeout
      // and not try to wait for all elements to finish loading.
      browser.pause(Timeouts.slow);
      beginTests(browser, token);
      done();
    });
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
