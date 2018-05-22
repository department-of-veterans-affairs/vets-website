const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts.js');
const RxHelpers = require('./rx-helpers');
const Auth = require('../../../platform/testing/e2e/auth');
const AccountCreationHelpers = require('../../../platform/testing/e2e/account-creation-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = Auth.getUserToken();

    RxHelpers.initApplicationSubmitMock(token);
    AccountCreationHelpers.initMHVTermsMocks(token);

    // Ensure active page renders
    Auth.logIn(token, client, '/health-care/prescriptions', 3)
      .assert.title('Refill Prescriptions: Vets.gov')
      .waitForElementVisible('#rx-active', Timeouts.normal);

    // Ensure that list view renders
    client
      .expect.element('.rx-table-list').to.be.visible;

    // Ensure that card view renders
    client
      .click('.rx-view-toggle li:first-child')
      .expect.element('.rx-prescription-card').to.be.visible;

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
      .expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.be.present;

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    client
      .click('button.rx-prescription-button')
      .expect.element('#rx-confirm-refill').to.be.visible;
    client
      .click('.rx-modal-refillinfo button[type=submit]')
      .expect.element('#rx-confirm-refill').to.not.be.present.after(Timeouts.normal);

    // Ensure refill request is submitted
    client.expect.element('.rx-prescription-card:nth-of-type(2) button.rx-trigger').text.to.equal('Submitted');

    // Ensure prescription detail page renders
    client
      .click('.rx-prescription-info .rx-prescription-title a')
      .waitForElementVisible('#rx-details', Timeouts.slow)
      .expect.element('#rx-prescription h1').text.to.equal('ACETAMINOPHEN 325MG TAB');

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
      .expect.element('.va-nav-breadcrumbs-list li:nth-of-type(3) a').to.be.present;

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    // Ensure track package page renders
    client
      .click('.va-tabs li:last-child a')
      .waitForElementVisible('#rx-track-package', Timeouts.slow);

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
      .expect.element('.va-nav-breadcrumbs-list li:nth-of-type(3) a').to.be.present;

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    // Ensure history card renders
    client
      .click('.va-nav-breadcrumbs a[href="/health-care/prescriptions/"]')
      .waitForElementVisible('#rx-active', Timeouts.slow)
      .click('.va-tabs li:last-child a')
      .waitForElementVisible('#rx-history', Timeouts.normal)
      .waitForElementVisible('.rx-table', Timeouts.slow)
      .expect.element('.rx-tab-explainer').to.be.visible;

    client
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('a[aria-current="page"', Timeouts.normal)
      .expect.element('.va-nav-breadcrumbs-list li:nth-of-type(3) a').to.be.present;

    // Mobile test, most common size
    client.resizeWindow(375, 6667);

    client.waitForElementVisible('.va-nav-breadcrumbs-list__mobile-link', Timeouts.normal);
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(2) a').to.not.be.present;
    client.expect.element('a[aria-current="page"]').to.not.be.present;

    // Reset default size
    client.resizeWindow(1024, 768);

    // Ensure settings page renders
    client
      .click('.rx-settings-button')
      .waitForElementVisible('#rx-settings', Timeouts.slow);

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
