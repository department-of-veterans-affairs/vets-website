const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

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

    // go to files tab
    client
      .click('.va-tabs li:nth-child(2) > a')
      .waitForElementVisible('.file-request-list-item', Timeouts.normal);

    // alert is visible
    client
      .expect.element('.ask-va-alert').to.be.visible;

    // click on link to page
    client
      // I have no idea why this pause is required, but it sure is
      .pause(2000)
      .click('.ask-va-alert a')
      .waitForElementPresent('.request-decision-button', Timeouts.normal);


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
