const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');
const DisabilityHelpers = require('./claims-status-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();
  DisabilityHelpers.initClaimsListMock(token);
  // Claim is visible
  Auth.logIn(token, client, '/track-claims', 3)
    .assert.title('Track Claims: VA.gov')
    .waitForElementVisible('.claim-list-item-container', Timeouts.slow);
  client
    .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
    .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
    .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
    .axeCheck('.main');

  client.expect.element(
    '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
  ).to.be.present;
  client.expect
    .element(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    )
    .text.to.equal('Check your claims and appeals');
  client.expect
    .element(
      '.va-nav-breadcrumbs-list li:nth-of-type(2) a[aria-current="page"]',
    )
    .to.have.css('pointer-events')
    .which.equal('none');

  // Mobile test, most common size
  client.resizeWindow(375, 667);
  client.waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal);

  // This first test fails in non-headless testing because the browser doesn't
  // resize down to 375px; it sticks at 500px, and the only way to make it
  // smaller is to manually toggle the device toolbar and make it responsive or
  // set the device to iPhone 6/7/8
  client.expect
    .element('.va-nav-breadcrumbs-list li:not(:nth-last-child(2))')
    .to.have.css('display')
    .which.equal('none');
  client.expect
    .element('.va-nav-breadcrumbs-list li:nth-last-child(2)')
    .text.to.equal('Home');
  client.expect
    .element('.va-nav-breadcrumbs-list li:nth-last-child(2)')
    .to.have.css('display')
    .which.equal('inline-block');

  // Reset default size
  client.resizeWindow(1024, 768);
  client.end();
});
