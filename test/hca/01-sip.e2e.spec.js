const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const HcaHelpers = require('../e2e/hca-helpers.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const url = `${E2eHelpers.baseUrl}/health-care/apply/application`;
    HcaHelpers.initSaveInProgressMock(url, client);

    // Ensure introduction page renders.
    client
      .url(url)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.usa-button-primary', Timeouts.slow);  // First render of React may be slow.

    client.axeCheck('.main');

    // load an in progress form
    client
      .click('.usa-button-primary');

    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');
    client.assert.urlContains('/veteran-information/birth-information');

    client
      .waitForElementVisible('.schemaform-sip-save-link', Timeouts.normal)
      .expect.element('#root_veteranSocialSecurityNumber').to.have.value.that.equals('123445544');

    // save a form
    client
      .pause(1000)
      .click('.schemaform-sip-save-link');

    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/birth-information');
    client.assert.urlContains('form-saved');

    client.axeCheck('.main');

    // test start over, but all it really does is fetch the form again
    client
      .click('.usa-button-secondary')
      .waitForElementVisible('.va-modal', Timeouts.normal)
      .click('.va-modal .usa-button-primary');

    E2eHelpers.expectNavigateAwayFrom(client, 'form-saved');
    client.assert.urlContains('/veteran-information/birth-information');

    client.end();
  });
