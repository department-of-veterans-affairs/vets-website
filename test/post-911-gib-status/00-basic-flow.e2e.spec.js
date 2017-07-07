const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const GibsHelpers = require('../e2e/post-911-gib-status-helpers.js');
// const HcaHelpers = require('../e2e/hca-helpers.js');
// const testData = require('./schema/maximal-test.json');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    GibsHelpers.initApplicationMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/education/gi-bill/post-9-11/ch-33-benefit`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Check Benefit: Vets.gov');
      // .waitForElementVisible('.schemaform-title', Timeouts.slow)  // First render of React may be slow.
      // .click('.usa-button-primary');

    // E2eHelpers.overrideVetsGovApi(client);
    // E2eHelpers.overrideSmoothScrolling(client);
    // E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // // Personal Information page.
    // client.expect.element('input[name="root_veteranFullName_first"]').to.be.visible;
    // HcaHelpers.completePersonalInformation(client, testData.data);
    // client.axeCheck('.main')
    //   .click('.form-panel .usa-button-primary');
    // E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // // Review and Submit Page.
    // client
    //   .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow)
    //   .pause(1000)
    //   .click('input[type="checkbox"]')
    //   .axeCheck('.main')
    //   .click('.form-progress-buttons .usa-button-primary');
    // // E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
    // client.expect.element('.js-test-location').attribute('data-location')
    //   .to.not.contain('/review-and-submit').before(Timeouts.slow);

    // // Submit message
    // client.expect.element('.success-alert-box').to.be.visible;

    client.axeCheck('.main');

    client.end();
  }
);
