const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
const createMockEndpoint = require('../../../../../platform/testing/e2e/mock-helpers');
const Auth = require('../../../../../platform/testing/e2e/auth');
const routes = require('./routes.json');
const token = Auth.getUserToken();

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
  },
  serviceHistory: {
    selector: '.va-profile-servicehistory',
    value: 'Army'
  }
};


function runEmailTest(browser, fieldName = 'email', initialValue = 'veteran@gmail.com') {
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialValue);
}

function runPhoneTest(browser, fieldName, initialValue) {
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialValue);
}

function runAddressTest(browser, fieldName, initialLine1, initialLine2) {
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialLine1);
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialLine2);
}

function createMockRoutes() {
  const promises = [];
  for (const route of routes) {
    promises.push(createMockEndpoint(token, route));
  }
  return Promise.all(promises);
}

function begin(browser) {
  browser.perform(async done => {
    await createMockRoutes();

    // Login to access the Profile
    Auth.logIn(token, browser, '/profile', 3)
      .waitForElementVisible('.va-profile-wrapper', Timeouts.slow);

    // General setup
    E2eHelpers.overrideSmoothScrolling(browser);

    // There's so much data loading async that it's easiest to just do a slow timeout
    // and not try to wait for all elements to finish loading.
    browser.pause(Timeouts.slow);

    runAddressTest(browser, 'mailingAddress', '1493 Martin Luther King Rd, string string', 'Fulton, New York 97062');
    runAddressTest(browser, 'homeAddress', 'PSC 808 Box 37', 'FPO, Armed Forces Europe (AE) 09618');

    runPhoneTest(browser, 'homePhone', '+ 1 (503) 222-2222 x0000');
    runPhoneTest(browser, 'mobilePhone', '+ 1 (503) 555-1234 x0000');

    runEmailTest(browser);

    browser.pause(100000);
    done();
  });
}

module.exports = E2eHelpers.createE2eTest(begin);
