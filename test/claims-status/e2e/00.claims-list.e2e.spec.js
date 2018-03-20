const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    // Claim is visible
    LoginHelpers.logIn(token, client, '/track-claims', 3)
      .assert.title('Track Claims: Vets.gov')
      .waitForElementVisible('.claim-list-item-container', Timeouts.slow)
      .axeCheck('.main'); // TODO: Figure out why this is failing

    // Combined claim link
    client
      .click('a.claims-combined')
      .waitForElementVisible('.claims-status-upload-header', Timeouts.normal);
    client
      .expect.element('.claims-status-upload-header').text.to.equal('A note about consolidated claims');
    client
      .click('.va-modal-close')
      .waitForElementNotPresent('.claims-status-upload-header', Timeouts.normal);

    // Verify text on page
    client
      .expect
      .element('.claims-container h1')
      .text.to.equal('Your Compensation Appeals and Claims');

    client
      .expect
      .element('.claim-list-item-header-v2')
      // .text.to.equal('Disability Compensation Claim – Received September 23, 2008');
      .text.to.equal('Claim for Disability Compensation\nReceived September 23, 2008');

    // Click to detail view
    client
      .click('.claim-list-item-container:first-child a.usa-button-primary')
      .assert.urlContains('/your-claims/11/status');

    client.end();
  }
);
