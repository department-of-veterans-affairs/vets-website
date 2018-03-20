const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts');
const PageHelpers = require('../../e2e/vre-ch31-helpers');
const testData = require('./schema/maximal-test.json');

const runTest = E2eHelpers.createE2eTest(
  (client) => {
    PageHelpers.initApplicationSubmitMock();

    // renders introduction page
    client
      .url(`${E2eHelpers.baseUrl}/employment/vocational-rehab-and-employment/application/chapter31`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for vocational rehabilitation: Vets.gov')
      .waitForElementVisible('.schemaform-title', Timeouts.slow)
      .click('.schemaform-start-button');

    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran information page
    client.waitForElementPresent('input[name="root_veteranFullName_first"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeVeteranInformation(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

    // Military history
    client.waitForElementPresent('input[name="root_serviceHistory_0_serviceBranch"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(2)', 'progress-segment-complete');
    PageHelpers.completeMilitaryHistory(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-information');

    // Military history
    client.waitForElementPresent('input[name="root_view:isWorking"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(3)', 'progress-segment-complete');
    PageHelpers.completeEmployerInformation(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-history');

    // Education information
    client.waitForElementPresent('input[name="root_yearsOfEducation"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(4)', 'progress-segment-complete');
    PageHelpers.completeEducationInformation(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/education-information');

    // Disability information
    client.waitForElementPresent('select[name="root_disabilityRating"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(5)', 'progress-segment-complete');
    PageHelpers.completeDisabilityInformation(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/disability-information');

    // Contact information
    client.waitForElementPresent('input[name="root_daytimePhone"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(6)', 'progress-segment-complete');
    // PageHelpers.completeContactInformation(client, testData.data);
    // client.axeCheck('.main')
      // .click('.form-panel .usa-button-primary');
    // E2eHelpers.expectNavigateAwayFrom(client, '/contact-information');

    client.end();
  }
);

module.exports = runTest;
// module.exports['@disabled'] = true;
