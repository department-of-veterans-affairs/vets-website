const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const DisabilityHelpers = require('../../util/disability-helpers');
const LoginHelpers = require('../../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, false, false, 3);

    LoginHelpers.logIn(token, client, '/disability-benefits/track-claims', 3)
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);
    client
      .click('a.claim-list-item:first-child')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.normal);

    client
      .click('.claim-completion-estimation a')
      .waitForElementVisible('.estimation-header', Timeouts.normal);

    client
      .expect.element('.disability-benefits-content h1').text.to.equal('How We Come Up with Your Estimated Decision Date');

    client.end();
  }
);
