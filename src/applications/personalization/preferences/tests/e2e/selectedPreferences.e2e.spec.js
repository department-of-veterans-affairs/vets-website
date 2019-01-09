const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const Auth = require('platform/testing/e2e/auth');

import { initHealthGetMock } from './helpers';
// This would make a great candidate for integration testing
// given the frequency of interaction between the FE and BE

function selectedPreferences(browser, token) {
  // Verify homelessness alert
  initHealthGetMock(token);
  browser
    .url(`${E2eHelpers.baseUrl}/my-va/`)
    .waitForElementVisible('.usa-alert-warning', Timeouts.slow);
  browser.assert.containsText(
    '.usa-alert-warning',
    'If you’re homeless or at risk of becoming homeless:',
  );

  // dismiss alert
  browser.click('.va-alert-close');
  browser.waitForElementNotPresent('.usa-alert-warning', 5000);

  // DELETE
  browser.click('.preference-item-title .va-button-link');
  browser.waitForElementPresent('.usa-alert-warning', Timeouts.normal);

  // TODO: confirm delete
  // TODO: check that benefit is gone
}

module.exports = E2eHelpers.createE2eTest(browser => {
  const token = Auth.getUserToken();

  // Login to access the dashboard
  Auth.logIn(token, browser, '/dashboard', 3).waitForElementVisible(
    '.user-profile-row',
    Timeouts.normal,
  );

  selectedPreferences(browser, token);
  browser.end();
});
