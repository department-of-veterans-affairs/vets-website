if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../../util/e2e-helpers');
  const Timeouts = require('../../util/timeouts.js');
  const DisabilityHelpers = require('../../util/disability-helpers');
  const LoginHelpers = require('../../util/login-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      DisabilityHelpers.initClaimsListMock();

      LoginHelpers.logIn(client, '/disability-benefits/track-claims', 3);

      DisabilityHelpers.initClaimDetailMocks(false, true, false, 8);

      client
        .url(`${E2eHelpers.baseUrl}/disability-benefits/track-claims`)
        .waitForElementVisible('a.claim-list-item', Timeouts.slow);
      client
        .click('a.claim-list-item:first-child')
        .waitForElementVisible('body', Timeouts.normal)
        .waitForElementVisible('.claim-title', Timeouts.slow);

      // go to details tab
      client
        .click('.va-tabs li:nth-child(3) > a')
        .waitForElementVisible('.claim-types', Timeouts.normal);
      client.assert.urlContains('/your-claims/11/details');

      client
        .expect.element('a.va-tab-trigger.va-tab-trigger--current').text.to.equal('Details');

      client
        .expect.element('.claim-types h6').text.to.equal('Claim Type');
      client
        .expect.element('.claim-conditions-list h6').text.to.equal('Your Claimed Conditions');
      client
        .expect.element('.claim-date-recieved h6').text.to.equal('Date Recieved');
      client
        .expect.element('.claim-va-representative h6').text.to.equal('Your Representative For VA Claims');

      client.end();
    }
  );
}
