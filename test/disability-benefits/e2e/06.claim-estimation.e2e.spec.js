const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

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

    const selector = '.claim-completion-estimation a';

    client
      .pause(500) // Since the link is below the fold, we must wait for the full render to finish
      .waitForElementVisible(selector, Timeouts.normal)
      .click(selector)
      .waitForElementVisible('.estimation-header', Timeouts.normal);

    client
      .expect.element('.disability-benefits-content h1').text.to.equal('How We Come Up with Your Estimated Decision Date');

    client.end();
  }
);
