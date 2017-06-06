const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const MessagingHelpers = require('../e2e/messaging-helpers');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    MessagingHelpers.initApplicationSubmitMock(token);

    // Test flow for unauthed and LOA1 users
    LoginHelpers.testUnauthedUserFlow(client, '/healthcare/messaging');

    // Ensure main page (inbox) renders.
    LoginHelpers.logIn(token, client, '/healthcare/messaging', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('.main')
      .assert.title('Send a message to your provider: Vets.gov')
      .waitForElementVisible('#messaging-app', Timeouts.slow);

    client
      .waitForElementVisible('#messaging-nav', Timeouts.slow)
      .waitForElementVisible('#messaging-content-header', Timeouts.slow)
      .waitForElementPresent('#messaging-folder-controls', Timeouts.normal)
      // Expect messages to show up.
      .expect.element('.msg-table-list td:nth-of-type(1) a:nth-of-type(1)').text.to.equal('Clinician');

    client.click('.msg-table-list td:nth-of-type(1) a:nth-of-type(1)');

    // Ensure thread view renders.
    client
      .waitForElementVisible('#messaging-nav', Timeouts.slow)
      .waitForElementVisible('#messaging-content', Timeouts.normal)
      .waitForElementVisible('textarea[name="messageText"]', Timeouts.slow)
      .axeCheck('.main')
      .expect.element('.messaging-thread-messages .messaging-thread-message:last-of-type .messaging-message-body').text.to.equal('Reply 3');

    // Expand previous message in thread.
    client
      .click('.messaging-thread-messages .messaging-thread-message:first-of-type')
      .expect.element('.messaging-thread-messages .messaging-thread-message:first-of-type .messaging-message-body').text.to.equal('Message');

    // Navigate out of thread view.
    client.click('.msg-btn-back');

    // Ensure compose message page renders.
    client
      .waitForElementVisible('.messaging-compose-button', Timeouts.slow)
      .click('.messaging-compose-button')
      .waitForElementVisible('textarea[name="messageText"]', Timeouts.slow)
      .axeCheck('.main')
      .selectDropdown('messageRecipient', '0')
      .selectDropdown('messageCategory', 'APPOINTMENTS');

    // Set message body.
    client.setValue('textarea[name="messageText"]', 'Test');

    // Send message successfully.
    client.click('.msg-send-buttons button:nth-of-type(1)')
      .waitForElementPresent('#messaging-folder-controls', Timeouts.slow)
      // Ensure success alert box is shown.
      .waitForElementVisible('.usa-alert-success', Timeouts.slow);

    // Ensure manage folders page renders.
    client.click('.msg-btn-managefolders')
      .waitForElementVisible('.va-tab-content', Timeouts.slow)
      .axeCheck('.main');

    // Ensure email notifications page renders
    client
      .click('.va-tabs li:last-child a')
      .waitForElementVisible('.va-tab-content', Timeouts.slow)
      .axeCheck('.main');

    // Update preferences successfully.
    client.click('#notifications-on')
      .click('.form-radio-buttons:nth-of-type(2) input')
      .clearValue('input[name="emailAddress"]')
      .setValue('input[name="emailAddress"]', 'user@vets.gov')
      .click('.msg-notifications-save button:first-child')
      .waitForElementVisible('.usa-alert-success', Timeouts.slow);

    client.end();
  }
);
