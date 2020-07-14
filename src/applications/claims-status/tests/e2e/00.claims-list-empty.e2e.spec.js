const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');
const DisabilityHelpers = require('./claims-status-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  DisabilityHelpers.initClaimsListEmptyMock(token);

  // Claim is visible
  Auth.logIn(token, client, '/track-claims', 3).waitForElementVisible(
    '.claims-container-title',
    Timeouts.slow,
  );

  // Verify text on page
  client.expect
    .element('.claims-alert')
    .text.to.contain('You do not have any submitted claims');

  client.axeCheck('.main');

  client.end();
});
