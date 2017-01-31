const E2eHelpers = require('../../util/e2e-helpers');
const Timeouts = require('../../util/timeouts.js');
const DisabilityHelpers = require('../../util/disability-helpers');
const LoginHelpers = require('../../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);

    DisabilityHelpers.initClaimDetailMocks(token, false, true, false, 8);

    LoginHelpers.logIn(token, client, '/disability-benefits/track-claims', 3)
      .waitForElementVisible('a.claim-list-item', Timeouts.slow);

    client
      .click('a.claim-list-item:first-child')
      .waitForElementVisible('body', Timeouts.slow)
      .waitForElementVisible('.claim-title', Timeouts.slow);

    // redirect to status tab
    client.assert.urlContains('/your-claims/11/status');

    // status tab highlighted
    client
      .expect.element('a.va-tab-trigger.va-tab-trigger--current').text.to.equal('Status');

    // conditions list
    client
      .expect.element('.claim-contentions .list').text.equals('Hearing Loss (New), skin condition (New), jungle rot (New)');

    // timeline
    client
      .expect.element('.five.last.step.section-current').to.be.present;
    client
      .expect.element('.one.step.section-complete').to.be.present;
    client
      .expect.element('.two.step.section-complete').to.be.present;
    client
      .expect.element('.three.step.section-complete').to.be.present;
    client
      .expect.element('.four.step.section-complete').to.be.present;

    // timeline expand
    client
      .click('li.step.one')
      .waitForElementVisible('li.step.one .claims-evidence', Timeouts.slow);
    client
      .expect.element('.claims-evidence:nth-child(3) .claims-evidence-item').text.equals('Your claim is closed');
    client
      .expect.element('button.older-updates').to.be.present;
    client
      .click('li.step.one')
      .waitForElementNotPresent('li.step.one .claims-evidence', Timeouts.slow);

    // files needed
    client
      .expect.element('.usa-alert-body h4').text.to.contain('your attention');

    client.end();
  }
);
