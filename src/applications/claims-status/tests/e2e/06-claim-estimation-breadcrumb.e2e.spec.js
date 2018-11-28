const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts.js');
const DisabilityHelpers = require('./claims-status-helpers');
const Auth = require('../../../../platform/testing/e2e/auth');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  DisabilityHelpers.initClaimsListMock(token);

  DisabilityHelpers.initClaimDetailMocks(token, false, false, false, 3);

  Auth.logIn(token, client, '/track-claims', 3).waitForElementVisible(
    '.claim-list-item-container',
    Timeouts.slow,
  );
  client
    .click('.claim-list-item-container:first-child a.usa-button-primary')
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.claim-title', Timeouts.normal);

  const selector = '.claim-estimate-link';

  client
    .pause(500) // Since the link is below the fold, we must wait for the full render to finish
    .waitForElementVisible(selector, Timeouts.normal)
    .click(selector)
    .waitForElementVisible('.claims-paragraph-header', Timeouts.normal);

  client.expect.element(
    '.va-nav-breadcrumbs-list li:nth-of-type(5) a[aria-current="page"]',
  ).to.be.present;
  client.expect
    .element(
      '.va-nav-breadcrumbs-list li:nth-of-type(5) a[aria-current="page"]',
    )
    .text.to.equal('Estimated Decision Date');
  client.expect
    .element(
      '.va-nav-breadcrumbs-list li:nth-of-type(5) a[aria-current="page"]',
    )
    .to.have.css('pointer-events')
    .which.equal('none');

  client.end();
});
