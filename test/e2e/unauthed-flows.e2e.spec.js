const AccountCreationHelpers = require('./account-creation-helpers');
const E2eHelpers = require('./e2e-helpers');
const GibsHelpers = require('./post-911-gib-status-helpers');
const LettersHelpers = require('./letters-helpers');
const LoginHelpers = require('./login-helpers');
const MessagingHelpers = require('./messaging-helpers');
const RxHelpers = require('./rx-helpers');

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
      // '/education/gi-bill/post-9-11/ch-33-benefit',
      '/health-care/health-records',
      '/health-care/messaging',
      '/health-care/prescriptions',
      '/letters',
      '/track-claims',
    ];

    // Test flow for unauthed and LOA1 users
    appPaths.forEach(path => {
      LoginHelpers.testUnauthedUserFlow(client, path);
    });

    client.end();
  }
);
