const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const createMockEndpoint = require('platform/testing/e2e/mock-helpers');
const Auth = require('platform/testing/e2e/auth');
const routes = require('./routes.json');

function beginTests(browser) {
  const fieldWrapper = `[data-field-name="mailingAddress"]`;
  const editButton = `${fieldWrapper} [data-action="edit"]`;
  const updateButton = 'button[data-action="save-edit"]';
  const userEnteredAddressInput = `label[for="userEntered"]`;
  const firstSuggestedAddressInput = `label[for="0"]`;
  browser
    .waitForElementVisible(editButton, Timeouts.verySlow)
    .click(editButton)
    .waitForElementVisible(updateButton, Timeouts.verySlow)
    .click(updateButton)
    .waitForElementVisible(userEnteredAddressInput, Timeouts.verySlow)
    .assert.containsText(userEnteredAddressInput, '1493 Martin Luther King Rd')
    .waitForElementVisible(firstSuggestedAddressInput, Timeouts.verySlow)
    .assert.containsText(
      firstSuggestedAddressInput,
      // eslint-disable-next-line no-useless-concat
      '400 NW 65th St\n' + 'Seattle, WA 98117',
    );
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
