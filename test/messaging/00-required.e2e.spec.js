const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const MessagingHelpers = require('../util/messaging-helpers');
const LoginHelpers = require('../util/login-helpers');
const selectDropdown = E2eHelpers.selectDropdown;

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    MessagingHelpers.initApplicationSubmitMock(token);

    LoginHelpers.logIn(token, client, '/healthcare/messaging', 3)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Send a message to your provider: Vets.gov')
      .waitForElementVisible('#messaging-app', Timeouts.slow);

    client
      .waitForElementVisible('#messaging-nav', Timeouts.slow)
      .waitForElementVisible('#messaging-content-header', Timeouts.slow)
      .waitForElementPresent('#messaging-folder-controls', Timeouts.normal)
      // expect messages to show up
      .expect.element('.msg-table-list td:nth-of-type(1) a:nth-of-type(1)').text.to.equal('Clinician');

    client.click('.msg-table-list td:nth-of-type(1) a:nth-of-type(1)');
    // ensure thread view loads correctly
    client
      .waitForElementVisible('#messaging-nav', Timeouts.slow)
      .waitForElementVisible('#messaging-content', Timeouts.normal)
      .expect.element('.messaging-thread-messages .messaging-thread-message:last-of-type .messaging-message-body').text.to.equal('Reply 3');
    // expand previous message in thread
    client
      .click('.messaging-thread-messages .messaging-thread-message:first-of-type')
      .expect.element('.messaging-thread-messages .messaging-thread-message:first-of-type .messaging-message-body').text.to.equal('Message');

    // navigate out of thread view
    client.click('.msg-btn-back');

    // Compose message view
    client
      .waitForElementVisible('.messaging-compose-button', Timeouts.slow)
      .click('.messaging-compose-button')
      .waitForElementVisible('textarea[name="messageText"]', Timeouts.slow);

    // select a recipient in the compose form
    selectDropdown(client, 'messageRecipient', '0');
    selectDropdown(client, 'messageCategory', 'APPOINTMENTS');

    // set message body
    client.setValue('textarea[name="messageText"]', 'Test');
    // send message successfully
    client.click('.msg-send-buttons button:nth-of-type(1)')
      .waitForElementPresent('#messaging-folder-controls', Timeouts.slow)
      // ensure success alert box is shown
      .waitForElementVisible('.usa-alert-success', Timeouts.slow);

    client.end();
  }
);
