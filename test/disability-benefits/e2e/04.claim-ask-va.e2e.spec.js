if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../../util/e2e-helpers');
  const Timeouts = require('../../util/timeouts.js');
  const DisabilityHelpers = require('../../util/disability-helpers');
  const LoginHelpers = require('../../util/login-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      DisabilityHelpers.initClaimsListMock();

      LoginHelpers.logIn(client, '/disability-benefits/track-claims', 3);

      DisabilityHelpers.initClaimDetailMocks(false, true, false, 3);
      DisabilityHelpers.initAskVAMock();

      client
        .url(`${E2eHelpers.baseUrl}/disability-benefits/track-claims`);
      client
        .click('a.claim-list-item:first-child')
        .waitForElementVisible('body', Timeouts.normal)
        .waitForElementVisible('.claim-title', Timeouts.normal);

      // alert is visible
      client
        .expect.element('.ask-va-alert').to.be.visible;

      // click on link to page
      client
        .click('.ask-va-alert a')
        .waitForElementVisible('.request-decision-button', Timeouts.normal);

      // click on disabled button
      client
        .click('.usa-button-primary');

      // should not have changed pages
      client.assert.urlContains('ask-va-to-decide');

      // click on checkbox, then submit, expect success message
      client
        .click('input[type=checkbox]')
        .click('.usa-button-primary');

      // should have gone back to status page
      client.assert.urlContains('status');

      client
        .waitForElementVisible('.usa-alert-success', Timeouts.normal);

      client.end();
    }
  );
}
