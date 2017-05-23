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
