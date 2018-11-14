const E2eHelpers = require('../../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../../platform/testing/e2e/timeouts');
const createMockEndpoint = require('../../../../../platform/testing/e2e/mock-helpers');
const Auth = require('../../../../../platform/testing/e2e/auth');
const routes = require('./routes.json');

function runEmailTest(
  browser,
  fieldName = 'email',
  initialValue = 'veteran@gmail.com',
) {
  const fieldWrapper = `[data-field-name="${fieldName}"]`;
  const editButton = `${fieldWrapper} [data-action="edit"]`;
  const editModal = `${fieldWrapper} #profile-edit-modal form[data-ready=true]`;
  const emailInput = `${fieldWrapper} input[name=email]`;
  const saveEditButton = `${fieldWrapper} button[data-action="save-edit"]`;
  const transactionPending = `${fieldWrapper} [data-transaction-pending]`;

  browser.assert.containsText(fieldWrapper, initialValue);
  browser.click(editButton);
  browser.waitForElementVisible(editModal, Timeouts.normal);

  browser.clearValue(emailInput);
  browser.setValue(emailInput, 'anything@gmail.com');

  browser.click(saveEditButton);
  browser.waitForElementVisible(transactionPending, Timeouts.normal);

  // Edit button should become visible again after transaction finishes
  browser.waitForElementVisible(editButton, Timeouts.slow);
}

function runPhoneTest(browser, fieldName, initialValue) {
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialValue);
}

function runAddressTest(browser, fieldName, initialLine1, initialLine2) {
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialLine1);
  browser.assert.containsText(`[data-field-name="${fieldName}"]`, initialLine2);
}

function runHeroTests(browser) {
  browser.assert.containsText(
    '[data-field-name="fullName"]',
    'First Middle Last',
  );
}

function runPersonalInformationTest(browser) {
  browser.assert.containsText('[data-field-name="gender"]', 'Male');
  browser.assert.containsText(
    '[data-field-name="birthDate"]',
    'March 21, 1972',
  );
}

function runMilitaryInformationTests(browser) {
  browser.assert.containsText('[data-field-name="serviceHistory"]', 'Army');
}

function beginTests(browser) {
  runHeroTests(browser);
  runPersonalInformationTest(browser);
  runMilitaryInformationTests(browser);

  runAddressTest(
    browser,
    'mailingAddress',
    '1493 Martin Luther King Rd, string string',
    'Fulton, New York 97062',
  );
  runAddressTest(
    browser,
    'residentialAddress',
    'PSC 808 Box 37',
    'FPO, Armed Forces Europe (AE) 09618',
  );

  runPhoneTest(browser, 'homePhone', '+ 1 (503) 222-2222 x0000');
  runPhoneTest(browser, 'mobilePhone', '+ 1 (503) 555-1234 x0000');

  runEmailTest(browser);
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
