const E2eHelpers = require('../../../e2e/e2e-helpers');
const Timeouts = require('../../../e2e/timeouts.js');
const HcaHelpers = require('../../../e2e/hca-helpers.js');
// const testData = require('../../../hca/schema/maximal-test.json');

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

    // // Complete entire form
    // HcaHelpers.completeEntireForm(client, testData.data);

    // // Open first panel
    // client
    //   .waitForElementVisible('.usa-accordion-bordered', Timeouts.normal)
    //   .click('button.usa-button-unstyled')
    //   .pause(1200);
    // client.expect.element('.edit-btn').to.be.visible;

    // // Edit form fields successfully
    // client
    //   .click('.edit-btn');
    // client.expect.element('input[name="root_veteranFullName_first"]').to.be.visible;

    // client
    //   .clearValue('input[name="root_veteranFullName_first"]')
    //   .fill('input[name="root_veteranFullName_first"]', 'Jacques')
    //   .click('.usa-button-primary');

    // client.expect.element('.review-row span').text.to.equal('Jacques');

    // // Edit form fields unsuccessfully
    // client.waitForElementVisible('.edit-btn', Timeouts.normal);
    // client
    //   .click('.edit-btn');
    // client.expect.element('input[name="root_veteranFullName_first"]').to.be.visible;

    // client
    //   .removeText('input[name="root_veteranFullName_first"]')
    //   .pause(1200)
    //   .click('input[name="root_veteranFullName_middle"]')
    //   .pause();

    // client
    //   .click('.usa-button-primary');

    // client.expect.element('.usa-input-error').to.be.visible;
    // client.expect.element('input[name="root_veteranFullName_first"]').to.be.visible;

    // // Fix validation errors and save successfully
    // client
    //   .fill('input[name="root_veteranFullName_first"]', 'Jean-Pierre')
    //   .click('.usa-button-primary');

    // client.expect.element('.review-row span').text.to.equal('Jean-Pierre');

    // // Close panel
    // client.expect.element('.edit-btn').to.be.visible;
    // client
    //   .click('button.usa-button-unstyled');

    // client.expect.element('.edit-btn').to.not.be.visible;

    // Click privacy agreement  
    client
      .waitForElementVisible('label[name="privacyAgreement-label"]', Timeouts.slow)
      .click('input[type="checkbox"]')
      // Disabling axeCheck for now, to return to in a separate PR
      // .axeCheck('.main')
      .click('.form-progress-buttons .usa-button-primary');

    E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.slow);

    // Submit message
    client.expect.element('.confirmation-page-title').to.be.visible;

    client.axeCheck('.main');

    client.end();
  });
