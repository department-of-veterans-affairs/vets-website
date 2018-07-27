const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const DisabilityHelpers = require('./claims-status-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');
const moment = require('moment');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = Auth.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 6, moment().add(5, 'years').format('YYYY-MM-DD'));

    Auth.logIn(token, client, '/track-claims', 3)
      .waitForElementVisible('.claim-list-item-container', Timeouts.slow);

    client
      .click('.claim-list-item-container:first-child a.usa-button-primary')
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    // redirect to status tab
    client.assert.urlContains('/your-claims/11/status');

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal);

    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').to.be.present;
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').text.to.equal('Status Details');
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').to.have.css('pointer-events').which.equal('none');

    // Mobile test, most common size
    client.resizeWindow(375, 667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))').to.have.css('display').which.equal('none');
    client.expect.element('.va-nav-breadcrumbs-list li:nth-last-child(2)').text.to.equal('Track Your Claims and Appeals');
    client.expect.element('.va-nav-breadcrumbs-list li:nth-last-child(2)').to.have.css('display').which.equal('inline-block');

    // Reset default size
    client.resizeWindow(1024, 768);

    client.end();
  }
);
