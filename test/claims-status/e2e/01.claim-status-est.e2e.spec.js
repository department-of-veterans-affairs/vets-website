const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');
const moment = require('moment');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 6, moment().add(1, 'years').format('YYYY-MM-DD'));

    LoginHelpers.logIn(token, client, '/track-claims', 3)
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);

    client
      .click('a.claim-list-item:first-child')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    // redirect to status tab
    client.assert.urlContains('/your-claims/11/status');

    client
      .expect.element('.claim-completion-desc').text.to.contain('base this on claims similar to yours');

    client.end();
  }
);
