const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');
const DisabilityHelpers = require('./claims-status-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  DisabilityHelpers.initClaimsListMock(token);

  DisabilityHelpers.initClaimDetailMocks(token, false, false, false, 3);

  Auth.logIn(token, client, '/track-claims', 3).waitForElementVisible(
    '.claim-list-item-container',
    Timeouts.slow,
  );
  client
    .click('.claim-list-item-container:first-child a.usa-button-primary')
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.claim-title', Timeouts.normal)
    .axeCheck('.main');

  /* Disabled until COVID-19 message removed
  const selector = '.claim-estimate-link';

  client
    .pause(500) // Since the link is below the fold, we must wait for the full render to finish
    .waitForElementVisible(selector, Timeouts.normal)
    .click(selector)
    .waitForElementVisible('.claims-paragraph-header', Timeouts.normal)
    .axeCheck('.main');

  client.expect
    .element('.claims-status-content h1')
    .text.to.equal('How we come up with your estimated decision date');
  */
  client.end();
});
