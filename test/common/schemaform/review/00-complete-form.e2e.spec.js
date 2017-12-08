const E2eHelpers = require('../../../e2e/e2e-helpers');
const Timeouts = require('../../../e2e/timeouts.js');
const HcaHelpers = require('../../../e2e/hca-helpers.js');
const testData = require('../../../hca/schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    HcaHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/health-care/apply/application`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.schemaform-title', Timeouts.slow)  // First render of React may be slow.
      .click('.usa-button-primary');

    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Complete entire form
    HcaHelpers.completeEntireForm(client, testData.data);

    // Open first panel
    client
      .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow)
      .click('button.usa-button-unstyled');
    client.expect.element('.usa-accordion-content').to.be.visible;


    // Click privacy agreement  
    client
      .click('input[type="checkbox"]')
      .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.slow);

    // Submit message
    client.expect.element('.confirmation-page-title').to.be.visible;

    client.axeCheck('.main');

    client.end();
  });
