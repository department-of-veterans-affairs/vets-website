const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);
    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 8);

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
    client.assert.urlContains('/your-claims/11/files');
    client
      .expect.element('a.va-tab-trigger.va-tab-trigger--current').text.to.equal('Files');

    // should show two files requested
    client.elements('class name', 'file-request-list-item', (result) => {
      client.assert.equal(result.value.length, 3);
    });

    // should show four files received
    client.elements('class name', 'submitted-file-list-item', (result) => {
      client.assert.equal(result.value.length, 3);
    });

    // should show additional evidence box
    client
      .expect.element('.submit-additional-evidence .usa-alert').to.be.visible;

    // should show a submitted date message
    client
      .expect.element('.submitted-file-list-item:last-child h6').text.to.equal('Submitted');
    // should show a reviewed date message
    client
      .expect.element('.submitted-file-list-item h6').text.to.equal('Reviewed by VA');

    client.end();
  }
);
