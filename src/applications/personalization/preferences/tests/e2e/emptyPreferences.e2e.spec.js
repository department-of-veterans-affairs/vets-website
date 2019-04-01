const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const Auth = require('platform/testing/e2e/auth');

import {
  initEmptyGetMock,
  initChoicesGetMock,
  initHealthPostMock,
} from './helpers';

function emptyPreferences(browser, token) {
  initEmptyGetMock(token);
  initChoicesGetMock(token);
  initHealthPostMock(token);

  // init announcements
  browser.execute(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      '["welcome-to-new-va"]',
    );
  });

  // verify FTUX Find VA Benefits modal
  browser
    .url(`${E2eHelpers.baseUrl}/my-va`)
    .waitForElementVisible('.va-modal-body', Timeouts.slow);
  browser.assert.containsText('.va-modal-body', 'Find VA Benefits');

  // accept find benefits modal
  browser
    .click('.va-modal-body .usa-button')
    // land on correct page
    .waitForElementVisible('#dashboard-title', Timeouts.slow);
  browser.assert.containsText('#dashboard-title', 'Find VA Benefits');

  // init announcements
  browser.execute(() => {
    // window.localStorage.clear();
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      '["welcome-to-new-va"]',
    );
  });

  // verify modal
  browser
    .url(`${E2eHelpers.baseUrl}/my-va`)
    .waitForElementVisible('.va-modal-body', Timeouts.slow);
  browser.assert.containsText('.va-modal-body', 'Find VA Benefits');

  // decline find benefits modal
  browser
    .click('.va-modal-body .usa-button-secondary')
    // land on correct page
    .waitForElementVisible('#dashboard-title', Timeouts.slow);
  browser.assert.containsText('#dashboard-title', 'My VA');

  // init announcements
  browser.execute(() => {
    window.localStorage.setItem(
      'DISMISSED_ANNOUNCEMENTS',
      '["welcome-to-new-va","find-benefits-intro","personalization"]',
    );
  });

  // ensure that modal does not appear if it has been dismissed
  browser
    .url(`${E2eHelpers.baseUrl}/my-va`)
    .waitForElementVisible('body', Timeouts.slow);
  browser.assert.elementNotPresent('.va-modal-body');

  // without having selected any preferences, ensure that none appear
  browser.assert.containsText(
    '.user-profile-row div div div p',
    'You haven’t selected any benefits to learn about.',
  );

  // CANCEL
  browser
    .url(`${E2eHelpers.baseUrl}/my-va/find-benefits`)
    .waitForElementVisible(
      '.user-profile-row a.usa-button-secondary',
      Timeouts.slow,
    );
  browser.expect
    .element('.user-profile-row a.usa-button-secondary')
    .text.to.equal('Cancel');
  browser.click('.user-profile-row a.usa-button-secondary');
  browser.expect
    .element('#dashboard-title')
    .text.to.equal('My VA')
    .before(Timeouts.slow);

  // SAVE
  browser
    .url(`${E2eHelpers.baseUrl}/my-va/find-benefits`)
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.preference-item', Timeouts.normal);
  browser.click('.preference-item');
  browser.click('.user-profile-row button.usa-button');
  browser.expect
    .element('#dashboard-title')
    .text.to.equal('My VA')
    .before(Timeouts.slow);
  browser.assert.containsText(
    '.usa-alert-success',
    'We’ve saved your preferences.',
  );
  // Disable this test: It's both too slow and too fragile on Jenkins (fails
  // there, passes locally). Ideally the delay to remove the alert would be much
  // much shorter when running e2e tests.
  // browser.waitForElementNotVisible('.usa-alert-success', 5000);
}

module.exports = E2eHelpers.createE2eTest(browser => {
  const token = Auth.getUserToken();

  // Login to access the dashboard
  Auth.logIn(token, browser, '/dashboard', 3).waitForElementVisible(
    '.user-profile-row',
    Timeouts.normal,
  );

  emptyPreferences(browser, token);
  browser.end();
});
