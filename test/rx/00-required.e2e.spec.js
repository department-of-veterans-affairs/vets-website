const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const RxHelpers = require('../util/rx-helpers');
const LoginHelpers = require('../util/login-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const token = LoginHelpers.getUserToken();

    RxHelpers.initApplicationSubmitMock(token);

    // Ensure introduction page renders.
    LoginHelpers.logIn(token, client, '/healthcare/prescriptions', 3)
      .assert.title('Refill your prescriptions: Vets.gov')
      .waitForElementVisible('#rx-active', Timeouts.slow);
    // ensure that prescription card renders
    client.expect.element('.rx-prescription').to.be.visible;

    // ensure glossary modal triggers correctly
    client
      .click('button.rx-trigger')
      .expect.element('#rx-glossary-modal').to.be.visible;
    // ensure glossary modal can be dismissed
    client
      .click('.va-modal-button-group button')
      .expect.element('#rx-glossary-modal').to.not.be.present;

    client
      .click('button.rx-prescription-button')
      .expect.element('#rx-confirm-refill').to.be.visible;

    client
      .click('.rx-modal-refillinfo button[type=submit]')
      .expect.element('#rx-confirm-refill').to.not.be.present.after(Timeouts.normal);

    // ensure refill request is submitted
    client.expect.element('.rx-prescription:nth-of-type(2) button.rx-trigger').text.to.equal('Submitted');

    // ensure prescription detail page is accessible
    client
      .click('.rx-prescription-info .rx-prescription-title a')
      .waitForElementVisible('#rx-detail', Timeouts.slow)
      .waitForElementVisible('#rx-detail h2', Timeouts.slow)
      .expect.element('#rx-detail h2').text.to.equal('ACETAMINOPHEN 325MG TAB');

    // expect tracking information to be accurate
    client.expect.element('#rx-order-history tr:nth-of-type(1) a.rx-track-package-link').text.to.equal('657068347564');
    client.expect.element('#rx-order-history tr:nth-of-type(2) a.rx-track-package-link').text.to.equal('345787647659');
    client.expect.element('#rx-order-history tr:nth-of-type(3) a.rx-track-package-link').text.to.equal('345787647654');

    // assert existence of correct message provider link
    client.expect.element('a.rx-message-provider-link').to.have.attribute('href').which.contains('/healthcare/messaging/compose');

    // ensure history view is accessible
    client
      .click('.rx-breadcrumbs a[href="/healthcare/prescriptions/"]')
      .waitForElementVisible('#rx-active', Timeouts.slow)
      .click('.va-tabs li:last-child a')
      .waitForElementVisible('#rx-history', Timeouts.normal)
      .waitForElementVisible('.rx-table', Timeouts.slow);
    // ensure history view renders
    client.expect.element('.rx-tab-explainer').to.be.visible;

    client.end();
  }
);
