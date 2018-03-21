const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');
const DisabilityHelpers = require('../../e2e/disability-helpers');
const LoginHelpers = require('../../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 8);

    LoginHelpers.logIn(token, client, '/track-claims', 3)
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

    // conditions list
    client
      .expect.element('.claim-contentions > span').text.equals('Hearing Loss (New), skin condition (New), jungle rot (New)');

    // timeline
    client
      .expect.element('.list-five.section-current').to.be.present;
    client
      .expect.element('.list-one.section-complete').to.be.present;
    client
      .expect.element('.list-two.section-complete').to.be.present;
    client
      .expect.element('.list-three.section-complete').to.be.present;
    client
      .expect.element('.list-four.section-complete').to.be.present;

    // timeline expand
    client
      .click('li.list-one')
      .waitForElementVisible('li.list-one .claims-evidence', Timeouts.slow);
    client
      .expect.element('.claims-evidence:nth-child(3) .claims-evidence-item').text.equals('Your claim is closed');
    client
      .expect.element('.claim-older-updates').to.be.present;
    client
      .click('li.list-one')
      .waitForElementNotPresent('li.list-one .claims-evidence', Timeouts.slow)
      .axeCheck('.main');

    // files needed
    client
      .expect.element('.usa-alert-body h4').text.to.contain('your attention');

    client.end();
  }
);
