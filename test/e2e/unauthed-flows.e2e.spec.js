const AccountCreationHelpers = require('./account-creation-helpers');
const E2eHelpers = require('../../src/platform/testing/e2e/helpers');
const GibsHelpers = require('../../src/js/post-911-gib-status/tests/post-911-gib-status-helpers');
const LettersHelpers = require('../../src/js/letters/tests/letters-helpers');
const LoginHelpers = require('./login-helpers');
const MessagingHelpers = require('../../src/js/messaging/tests/messaging-helpers');
const RxHelpers = require('../../src/js/rx/tests/rx-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    // init mocks
    AccountCreationHelpers.initMHVTermsMocks(token);
    GibsHelpers.initApplicationMock(token);
    LettersHelpers.initApplicationMock(token);
    MessagingHelpers.initApplicationSubmitMock(token);
    RxHelpers.initApplicationSubmitMock(token);

    const appPaths = [
      // While the page is in maintenance, it doesn't need authed
      '/education/gi-bill/post-9-11/ch-33-benefit/status',
      '/health-care/health-records',
      '/health-care/messaging',
      '/health-care/prescriptions',
      'download-va-letters/letters',
      '/track-claims',
    ];

    // Test flow for unauthed and LOA1 users
    appPaths.forEach(path => {
      LoginHelpers.testUnauthedUserFlow(client, path);
    });

    client.end();
  }
);
