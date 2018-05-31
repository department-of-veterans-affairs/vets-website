const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
const createMockEndpoint = require('../../../../../platform/testing/e2e/mock-helpers');
const Auth = require('../../../../../platform/testing/e2e/auth');
const routes = require('./routes.json');

const VERIFICATIONS = {
  email: {
    selector: '.va-profile-email',
    value: 'old_email@va.gov',
    update: {
      editSelector: '.va-profile-email .va-profile-edit-link',
      formSelector: '#profile-email-modal',
      inputSelector: '#profile-email-modal input[name=email]',
      submitSelector: '#profile-email-modal button[type=submit]',
      newValue: 'new_email@va.gov'
    }
  },
  fullName: {
    selector: '.va-profile-hero',
    value: 'First Middle Last'
  },
  mailingAddress: {
    selector: '.va-profile-address',
    value: '123 OLD ST'
  },
  primaryPhone: {
    selector: '.va-profile-phone',
    value: '(123) 456-7890'
  },
  gender: {
    selector: '.va-profile-gender',
    value: 'Male'
  },
  birthDate: {
    selector: '.va-profile-birthdate',
    value: 'Mar. 21, 1972'
  }
};

let token = null;

async function createMockRoutes() {
  /* eslint-disable no-await-in-loop */
  for (const route of routes) {
    await createMockEndpoint(token, route);
  }
}

function runTests(browser) {
  for (const property of Object.keys(VERIFICATIONS)) {
    const { selector, value, update } = VERIFICATIONS[property];
    browser.assert.containsText(selector, value);
    if (update) {
      const { editSelector, formSelector, inputSelector, submitSelector, newValue } = update;
      browser
        .click(editSelector)
        .waitForElementVisible(formSelector, Timeouts.normal)
        .clearValue(inputSelector)
        .setValue(inputSelector, newValue)
        .click(submitSelector)
        .pause(1000)
        .assert.containsText(selector, newValue);
    }
  }
}

function begin(browser) {
  browser.perform(async done => {
    // Mock the routes after getting a token to register the routes to that authentication
    token = Auth.getUserToken();
    await createMockRoutes();

    // Login to access the Profile
    Auth.logIn(token, browser, '/profile', 3)
      .waitForElementVisible('.va-profile-wrapper', Timeouts.slow)
      .axeCheck('document');

    // General setup
    E2eHelpers.overrideSmoothScrolling(browser);

    // There's so much data loading async that it's easiest to just do a slow timeout
    // and not try to wait for all elements to finish loading.
    browser.pause(Timeouts.normal);

    runTests(browser);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
