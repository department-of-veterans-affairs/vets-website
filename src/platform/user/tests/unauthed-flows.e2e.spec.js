const Auth = require('../../testing/e2e/auth');
const E2eHelpers = require('../../testing/e2e/helpers');
const Timeouts = require('../../testing/e2e/timeouts');

module.exports = E2eHelpers.createE2eTest(client => {
  const appPaths = [
    // While the page is in maintenance, it doesn't need authed
    '/education/gi-bill/post-9-11/ch-33-benefit/status',
    '/health-care/health-records',
    '/health-care/messaging',
    '/health-care/prescriptions',
    'download-va-letters/letters',
    '/track-claims',
  ];

  // Test clicking login required links
  client
    .url(E2eHelpers.baseUrl)
    .waitForElementVisible('body', Timeouts.normal)
    .click('[aria-controls="vetnav-benefits"]')
    .waitForElementVisible('#vetnav-benefits', Timeouts.normal)
    .click('#vetnav-benefits .login-required')
    .waitForElementVisible('#signin-signup-modal', Timeouts.normal);

  // Test flow for unauthed and LOA1 users
  appPaths.forEach(path => {
    Auth.testUnauthedUserFlow(client, path);
  });

  client.end();
});
