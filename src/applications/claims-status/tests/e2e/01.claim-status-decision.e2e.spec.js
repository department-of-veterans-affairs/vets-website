const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const DisabilityHelpers = require('./claims-status-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');
const ClaimsManifest =  require('../../manifest.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = Auth.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);
    DisabilityHelpers.initClaimDetailMocks(token, true, true, false, null);

    Auth.logIn(token, client, ClaimsManifest.rootUrl, 3)
      .waitForElementVisible('.claim-list-item-container', Timeouts.slow)
      .axeCheck('.main');

    client
      .click('.claim-list-item-container:first-child a.usa-button-primary')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    client
      .expect.element('.usa-alert').to.be.visible;

    client
      .expect.element('.usa-alert').text.to.contain('Your claim decision is ready');

    client
      .expect.element('.disability-benefits-timeline').not.to.be.present;

    client.end();
  }
);
