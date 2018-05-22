const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const DisabilityHelpers = require('./claims-status-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = Auth.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 8);

    Auth.logIn(token, client, '/track-claims', 3)
      .waitForElementVisible('.claim-list-item-container', Timeouts.slow);

    client
      .click('.claim-list-item-container:first-child a.usa-button-primary')
      .waitForElementVisible('body', Timeouts.slow)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    // redirect to status tab
    client.assert.urlContains('/your-claims/11/status');

    // status tab highlighted
    client
      .expect.element('a.va-tab-trigger.va-tab-trigger--current').text.to.equal('Status');

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
