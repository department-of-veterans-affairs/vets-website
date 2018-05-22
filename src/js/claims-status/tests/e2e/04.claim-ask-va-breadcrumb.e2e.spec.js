const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const DisabilityHelpers = require('./claims-status-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = Auth.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 3);

    DisabilityHelpers.initAskVAMock(token);

    Auth.logIn(token, client, '/track-claims', 3)
      .waitForElementVisible('.claim-list-item-container', Timeouts.slow);

    client
      .click('.claim-list-item-container:first-child a.usa-button-primary')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow)
      .axeCheck('.main');

    // go to files tab
    client
      .click('.va-tabs li:nth-child(2) > a')
      .waitForElementVisible('.file-request-list-item', Timeouts.normal);

    // alert is visible
    client
      .expect.element('.claims-alert-status').to.be.visible;

    client
      .expect.element('.claims-alert-status').text.to.contain('Ask for your Claim Decision');

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal);

    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').to.be.present;
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').to.have.css('pointer-events').which.equal('none');

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    client.end();
  }
);
