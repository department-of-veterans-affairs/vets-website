const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const Auth = require('platform/testing/e2e/auth');

import {
  initCareersAndEducationGetMock,
  initDeleteMock,
  initHealthPostMock,
} from './helpers';
// This would make a great candidate for integration testing
// given the frequency of interaction between the FE and BE

function removeFirstListedBenefit(browser) {
  // click the "X REMOVE" button to start removing the benefit
  browser.click('.preference-item-title .va-button-link');

  // click the confirm button to remove the Education benefit
  browser.waitForElementPresent(
    '.usa-alert-warning button.usa-button-primary',
    Timeouts.normal,
  );
  browser.click('.usa-alert-warning button.usa-button-primary');
  browser.waitForElementNotPresent('.usa-alert-warning', Timeouts.slow);
  browser.waitForElementPresent('.usa-alert-success', Timeouts.slow);
}

function selectedPreferences(browser, token) {
  initCareersAndEducationGetMock(token);
  initHealthPostMock(token);
  initDeleteMock(token);

  // go to Dashboard
  browser
    .url(`${E2eHelpers.baseUrl}/my-va/`)
    .waitForElementVisible('.usa-alert-warning', Timeouts.slow);

  // Verify homelessness alert
  browser.assert.containsText(
    '.usa-alert-warning',
    'If you’re homeless or at risk of becoming homeless:',
  );

  // dismiss homelessness alert
  browser.click('.va-alert-close');
  browser.waitForElementNotPresent('.usa-alert-warning', Timeouts.slow);

  // remove the Education benefit
  removeFirstListedBenefit(browser);

  // confirm that the Homeless Alert does not reappear
  browser.assert.elementNotPresent('.usa-alert-warning', Timeouts.slow);

  // remove the Careers benefit
  removeFirstListedBenefit(browser);

  // confirm that the Homeless Alert does not reappear
  browser.assert.elementNotPresent('.usa-alert-warning', Timeouts.slow);

  // confirm there are no longer any benefits selected
  browser.assert.containsText(
    '.user-profile-row div div div p',
    'You haven’t selected any benefits to learn about.',
  );
}

module.exports = E2eHelpers.createE2eTest(browser => {
  const token = Auth.getUserToken();

  // Login to access the dashboard
  Auth.logIn(token, browser, '/my-va', 3).waitForElementVisible(
    '.user-profile-row',
    Timeouts.normal,
  );

  selectedPreferences(browser, token);
  browser.end();
});
