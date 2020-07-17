const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts.js');
const Auth = require('platform/testing/e2e/auth');
const DisabilityHelpers = require('./claims-status-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();

  DisabilityHelpers.initClaimsListMock(token);

  // Claim is visible
  Auth.logIn(token, client, '/track-claims', 3).waitForElementVisible(
    '.claim-list-item-container',
    Timeouts.slow,
  );

  // Combined claim link
  client
    .click('button.claims-combined')
    .waitForElementVisible('.claims-status-upload-header', Timeouts.normal)
    // check modal
    .axeCheck('.main');

  client.expect
    .element('.claims-status-upload-header')
    .text.to.equal('A note about consolidated claims');
  client
    .click('.va-modal-close')
    .waitForElementNotPresent('.claims-status-upload-header', Timeouts.normal)
    .axeCheck('.main');

  // Verify text on page
  client.expect
    .element('.claims-container-title')
    .text.to.equal('Check your claim or appeal status');

  client.expect
    .element('.claim-list-item-header-v2')
    // .text.to.equal('Disability Compensation Claim – updated on September 23, 2008');
    .text.to.equal(
      'Claim for disability compensation\nupdated on October 31, 2016',
    );

  // Click to detail view
  client
    .click('.claim-list-item-container:first-child a.usa-button-primary')
    .assert.urlContains('/your-claims/11/status');

  client.end();
});
