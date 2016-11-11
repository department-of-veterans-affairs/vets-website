if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  const E2eHelpers = require('../../util/e2e-helpers');
  const Timeouts = require('../../util/timeouts.js');
  const DisabilityHelpers = require('../../util/disability-helpers');
  const LoginHelpers = require('../../util/login-helpers');

  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      DisabilityHelpers.initClaimsListMock();

      LoginHelpers.logIn(client, '/disability-benefits/track-claims', 3);

      DisabilityHelpers.initClaimDetailMocks(false, true, false, 8);

      client
        .url(`${E2eHelpers.baseUrl}/disability-benefits/track-claims`)
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
        client.assert.equal(result.value.length, 2);
      });

      // should show four files received
      client.elements('class name', 'submitted-file-list-item', (result) => {
        client.assert.equal(result.value.length, 4);
      });

      // should show additional evidence box
      client
        .expect.element('.submit-additional-evidence .usa-alert').to.be.visible;

      // should show a submitted date message
      client
        .expect.element('.submitted-file-list-item:last-child h6').text.to.equal('Submitted');
      // should show a reviewed date message
      client
        .expect.element('.submitted-file-list-item h6').text.to.equal('Reviewed By VA');

      client.end();
    }
  );
}
