const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const MessagingHelpers = require('../util/messaging-helpers');
const LoginHelpers = require('../util/login-helpers');

if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      MessagingHelpers.initApplicationSubmitMock();
      LoginHelpers.logIn(client, '/healthcare/messaging', 3);

      // Ensure messaging home page renders
      client
        .url(`${E2eHelpers.baseUrl}/healthcare/messaging`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Send a message to your provider: Vets.gov')
        .waitForElementVisible('#messaging-app', Timeouts.slow);

      client.end();
    }
  );
}
