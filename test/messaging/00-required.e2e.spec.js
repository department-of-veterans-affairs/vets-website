const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const MessagingHelpers = require('../util/messaging-helpers');
const LoginHelpers = require('../util/login-helpers');

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
      .waitForElementVisible('#messaging-folder-controls', Timeouts.normal)
      // expect messages to show up
      .expect.element('.msg-table-list td:nth-of-type(1) a:nth-of-type(1)').text.to.equal('Clinician');

    // Compose message view
    client
      .click('#messaging-folder-controls .messaging-compose-button')
      .waitForElementVisible('textarea[name="messageText"]', Timeouts.normal);
    // select a recipient in the compose form
    client.click('select[name=\'messageRecipient\']')
      .click('select option[value=\'0\']')
      .keys(['\uE006']);
    // select category
    client.click('select[name=\'messageCategory\']')
      .click('select option[value=\'APPOINTMENTS\']')
      .keys(['\uE006']);
    // set message body
    client.setValue('textarea[name="messageText"]', 'Test');
    // send message successfully
    client.click('.msg-send-buttons button:nth-of-type(1)')
      .waitForElementVisible('#messaging-folder-controls', Timeouts.normal)
      // ensure success alert box is shown
      .waitForElementVisible('.usa-alert-success', Timeouts.normal);

    client.end();
  }
);
