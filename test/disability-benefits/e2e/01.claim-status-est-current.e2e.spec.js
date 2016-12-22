const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const DisabilityHelpers = require('../../util/disability-helpers');
const LoginHelpers = require('../../util/login-helpers');
const moment = require('moment');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 6, moment().add(5, 'years').format('YYYY-MM-DD'));

    LoginHelpers.logIn(token, client, '/disability-benefits/track-claims', 3)
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);

    client
      .click('a.claim-list-item:first-child')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    // redirect to status tab
    client.assert.urlContains('/your-claims/11/status');

    client
      .expect.element('.claim-completion-estimation').text.to.contain('Estimate not available');

    client.end();
  }
);
