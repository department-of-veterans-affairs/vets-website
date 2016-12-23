const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const RxHelpers = require('../util/rx-helpers');
const LoginHelpers = require('../util/login-helpers');

if (!process.env.BUILDTYPE || process.env.BUILDTYPE === 'development') {
  module.exports = E2eHelpers.createE2eTest(
    (client) => {
      RxHelpers.initApplicationSubmitMock();
      LoginHelpers.logIn(client, '/healthcare/prescriptions', 3);

      // Ensure introduction page renders.
      client
        .url(`${E2eHelpers.baseUrl}/healthcare/prescriptions`)
        .waitForElementVisible('body', Timeouts.normal)
        .assert.title('Refill your prescriptions: Vets.gov')
        .waitForElementVisible('#rx-active', Timeouts.slow);
      // ensure that prescription card renders
      client.expect.element('.rx-prescription').to.be.visible;

      // ensure glossary modal triggers correctly
      client
        .click('button.rx-trigger')
        .expect.element('.rx-modal-body').to.be.visible;
      // ensure glossary modal can be dismissed
      client
        .click('.va-modal-button-group button')
        .expect.element('.rx-modal-body').to.not.be.found;

      // ensure prescription detail page is accessible
      client
        .click('.rx-prescription-info .rx-prescription-title a')
        .waitForElementVisible('#rx-detail', Timeouts.slow)
        .waitForElementVisible('#rx-detail h2', Timeouts.slow)
        .assert.containsText('#rx-detail h2', 'ACETAMINOPHEN 325MG TAB');

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
}
