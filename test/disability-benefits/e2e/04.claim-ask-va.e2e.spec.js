const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const DisabilityHelpers = require('../../util/disability-helpers');
const LoginHelpers = require('../../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 3);

    DisabilityHelpers.initAskVAMock(token);

    LoginHelpers.logIn(token, client, '/disability-benefits/track-claims', 3)
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);

    client
      .click('a.claim-list-item:first-child')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    // alert is visible
    client
      .expect.element('.ask-va-alert').to.be.visible;

    // click on link to page
    client
      .click('.ask-va-alert a')
      .waitForElementVisible('.request-decision-button', Timeouts.normal);

    // click on disabled button
    client
      .click('.usa-button-primary')
      .pause(500);

    // should not have changed pages
    client.assert.urlContains('ask-va-to-decide');

    // click on checkbox, then submit, expect success message
    client
      .click('input[type=checkbox]')
      .click('.usa-button-primary')
      .pause(500);

    // should have gone back to status page
    client.assert.urlContains('status');

    client
      .waitForElementVisible('.usa-alert-success', Timeouts.normal);

    client.end();
  }
);
