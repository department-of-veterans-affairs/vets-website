const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const DisabilityHelpers = require('../../util/disability-helpers');
const LoginHelpers = require('../../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);
    DisabilityHelpers.initClaimDetailMocks(token, true, true, false, null);

    LoginHelpers.logIn(token, client, '/disability-benefits/track-claims', 3)
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);

    client
      .click('a.claim-list-item:first-child')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    client
      .expect.element('.claim-decision-is-ready').to.be.visible;

    client
      .expect.element('.disability-benefits-timeline').not.to.be.present;

    client.end();
  }
);
