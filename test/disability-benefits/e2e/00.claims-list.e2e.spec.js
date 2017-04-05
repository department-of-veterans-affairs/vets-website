const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    // Claim is visible
    LoginHelpers.logIn(token, client, '/disability-benefits/track-claims', 3)
      .assert.title('Track Claims: Vets.gov')
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);

    // Combined claim link
    // TODO(crew): Ask someone to find out why this isn't working
    // client
    //   .click('a.claims-combined')
    //   .waitForElementVisible('.claims-status-upload-header', Timeouts.normal);
    // client
    //   .expect.element('.claims-status-upload-header').text.to.equal('Claim status update');
    // client
    //   .click('.va-modal-body .usa-button')
    //   .waitForElementNotPresent('.claims-status-upload-header', Timeouts.normal);

    // Verify text on page
    client
      .expect
      .element('.your-claims h1')
      .text.to.equal('Your Claims');

    client
      .expect
      .element('.claim-list-item-header')
      .text.to.equal('Disability Compensation Claim – Received September 23, 2008');

    // Click to detail view
    client
      .click('a.claim-list-item:first-child')
      .assert.urlContains('/your-claims/11/status');

    client.end();
  }
);
