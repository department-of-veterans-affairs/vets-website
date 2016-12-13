if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../../util/e2e-helpers');
  const Timeouts = require('../../util/timeouts.js');
  const DisabilityHelpers = require('../../util/disability-helpers');
  const LoginHelpers = require('../../util/login-helpers');
  const moment = require('moment');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      DisabilityHelpers.initClaimsListMock();

      LoginHelpers.logIn(client, '/disability-benefits/track-claims', 3);

      DisabilityHelpers.initClaimDetailMocks(false, true, false, 6, moment().add(1, 'years').format('YYYY-MM-DD'));

      client
        .url(`${E2eHelpers.baseUrl}/disability-benefits/track-claims`)
        .waitForElementVisible('a.claim-list-item', Timeouts.slow);
      client
        .click('a.claim-list-item:first-child')
        .waitForElementVisible('body', Timeouts.normal)
        .waitForElementVisible('.claim-title', Timeouts.slow);

      // redirect to status tab
      client.assert.urlContains('/your-claims/11/status');

      client
        .expect.element('.claim-completion-estimation').text.to.contain('base this on claims similar to yours');

      client.end();
    }
  );
}
