const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const MessagingHelpers = require('../util/messaging-helpers');
const LoginHelpers = require('../util/login-helpers');

if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      MessagingHelpers.initApplicationSubmitMock();
      LoginHelpers.logIn(client, '/healthcare/messaging', 3);

      client.end();
    }
  );
}
