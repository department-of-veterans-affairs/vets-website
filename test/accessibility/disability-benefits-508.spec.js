const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const DisabilityHelpers = require('../e2e/disability-helpers');
const LoginHelpers = require('../e2e/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    DisabilityHelpers.initClaimsListMock(token);
    DisabilityHelpers.initClaimDetailMocks(token, false, false, false, 3);

    LoginHelpers.logIn(token, client, '/track-claims', 3);

    // Claim list page
    client
      .url(`${E2eHelpers.baseUrl}/track-claims`);

    E2eHelpers.overrideSmoothScrolling(client);

    // Click consolidated claims button
    client
      .waitForElementVisible('a.claim-list-item', Timeouts.slow)
      .axeCheck('.main');

    client
      .click('a.claims-combined')
      .waitForElementVisible('.claims-status-upload-header', Timeouts.normal)
      .axeCheck('.main');

    client
      .click('.va-modal-close');

    // Claim status tab
    client
      .click('a.claim-list-item:first-child')
      // .waitForElementVisible('.claim-title', Timeouts.normal)
      .axeCheck('.main');

    // claim estimation page
    client
      // have to scroll to trigger all phases to show up
      .execute('window.scrollTo(0,8000)')
      .pause(500)
      .waitForElementPresent('.claim-completion-estimation', Timeouts.normal)
      .click('.claim-completion-estimation a')
      .waitForElementVisible('.estimation-header', Timeouts.normal)
      .axeCheck('.main');

    client
      .click('nav:not(.va-nav-breadcrumbs--gate) .va-nav-breadcrumbs-list li:nth-child(4) a')
      .waitForElementVisible('.claim-title', Timeouts.normal);

    // files tab
    client
      .click('.va-tabs li:nth-child(2) > a')
      .waitForElementVisible('.file-request-list-item', Timeouts.normal)
      .axeCheck('.main');

    // Ask VA page
    client
      .click('.usa-alert-info a')
      .waitForElementVisible('.request-decision-button', Timeouts.normal)
      .axeCheck('.main');

    client
      .click('nav:not(.va-nav-breadcrumbs--gate) .va-nav-breadcrumbs-list li:nth-child(4) a')
      .waitForElementVisible('.claim-title', Timeouts.normal)
      .click('.va-tabs li:nth-child(2) > a')
      .waitForElementVisible('.file-request-list-item', Timeouts.normal);

    // document request page
    client
      .click('.file-request-list-item a')
      .waitForElementVisible('.tracked-item-due', Timeouts.normal)
      .axeCheck('.main');

    client
      .click('nav:not(.va-nav-breadcrumbs--gate) .va-nav-breadcrumbs-list li:nth-child(4) a')
      .waitForElementVisible('.claim-title', Timeouts.normal);

    // turn in evidence page
    client
      .click('.submit-additional-evidence a')
      .waitForElementVisible('.upload-files', Timeouts.normal)
      .axeCheck('.main');

    client
      .click('nav:not(.va-nav-breadcrumbs--gate) .va-nav-breadcrumbs-list li:nth-child(4) a')
      .waitForElementVisible('.claim-title', Timeouts.normal);

    // details tab
    client
      .click('.va-tabs li:nth-child(3) > a')
      .waitForElementVisible('.claim-types', Timeouts.normal)
      .axeCheck('.main');

    client.end();
  }
);
