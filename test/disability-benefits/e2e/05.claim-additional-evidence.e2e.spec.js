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
        .waitForElementVisible('.claim-title', Timeouts.normal);

      // go to files tab
      client
        .click('.va-tabs li:nth-child(2) > a')
        .waitForElementVisible('.file-request-list-item', Timeouts.normal);

      // go to additional evidence page
      client
        .click('.additional-evidence-alert .usa-button')
        .waitForElementVisible('.upload-files', Timeouts.normal);

      client.assert.urlContains('additional-evidence');

      client
        .expect.element('.upload-files button.usa-button').text.to.equal('Submit Files for Review');

      client
        .click('.upload-files button.usa-button')
        .waitForElementPresent('.usa-input-error', Timeouts.normal);

      client
        .expect.element('.usa-input-error-message').text.to.equal('Please select a file first');

      // File uploads don't appear to work in Nightwatch/PhantomJS
      // TODO: switch to something that does support uploads or figure out the problem

      client.end();
    }
  );
}
