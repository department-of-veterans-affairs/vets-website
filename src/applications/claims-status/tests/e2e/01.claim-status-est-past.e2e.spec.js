const moment = require('moment');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');
const DisabilityHelpers = require('./claims-status-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  DisabilityHelpers.initClaimsListMock(token);

  DisabilityHelpers.initClaimDetailMocks(
    token,
    false,
    true,
    false,
    6,
    moment()
      .subtract(5, 'years')
      .format('YYYY-MM-DD'),
  );

  Auth.logIn(token, client, '/track-claims', 3).waitForElementVisible(
    '.claim-list-item-container',
    Timeouts.slow,
  );

  client
    .click('.claim-list-item-container:first-child a.vads-c-action-link--blue')
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.claim-title', Timeouts.slow)
    .axeCheck('.main');

  // redirect to status tab
  client.assert.urlContains('/your-claims/11/status');

  client.expect
    // Disabled until COVID-19 message removed
    // .element('.claim-completion-desc')
    // .text.to.contain('We estimated your claim would be completed by now');
    .element('.usa-alert-text')
    .text.to.contain('COVID-19 has had on');

  client.end();
});
