const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts');
const PageHelpers = require('../e2e/pensions-helpers');
const testData = require('./schema/maximal-test.json');

const runTest = E2eHelpers.createE2eTest(
  (client) => {
    PageHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/pension/application/527EZ`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for pension benefits: Vets.gov')
      .waitForElementVisible('.schemaform-title', Timeouts.slow)  // First render of React may be slow.
      .click('.usa-button-primary');

    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Applicant Information page
    client.waitForElementVisible('input[name="root_veteranFullName_first"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeApplicantInformation(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/applicant-information');

    // Military History page
    client.waitForElementVisible('input[name="root_servicePeriods_0_serviceBranch"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeMilitaryHistory(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/history');

    client.waitForElementVisible('label[for="root_view:serveUnderOtherNames"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeGeneralMilitaryInfo(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/general');

    client.waitForElementVisible('label[for="root_nationalGuardActivation"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeNationalGuard(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/reserve-national-guard');

    client.waitForElementVisible('label[for="root_view:powStatus"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completePOW(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military/pow-severance');

    // Work History page

    client.waitForElementVisible('label[for="root_disabilities_0_name"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeDisabilityHistory(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/disability/history');

    client.waitForElementVisible('label[for="root_view:workedBeforeDisabled"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeWorkHistory(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/employment/history');

    // marriage info
    client.waitForElementVisible('label[for="root_maritalStatus"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeMaritalStatus(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/marriage-info');

    // first marriage
    client.waitForElementVisible('label[for="root_spouseFullName_first"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeMarriage(client, testData.data, 0);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/marriages/0');

    // second marriage
    client.waitForElementVisible('label[for="root_spouseFullName_first"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeMarriage(client, testData.data, 1);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/marriages/1');

    // spouse info
    client.waitForElementVisible('label[for="root_spouseDateOfBirth"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeSpouseInfo(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/spouse-info');

    // spouse marriage
    client.waitForElementVisible('label[for="root_dateOfMarriage"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeSpouseMarriage(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/spouse-marriages/0');

    // dependents
    client.waitForElementVisible('label[for="root_view:hasDependents"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeDependents(client, testData.data);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');

    // dependent info
    client.waitForElementVisible('label[for="root_childPlaceOfBirth"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeDependentInfo(client, testData.data, 0);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/dependents/children/information/0');

    // dependent address info
    client.waitForElementVisible('label[for="root_childInHousehold"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeDependentAddressInfo(client, testData.data, 0);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/dependents/children/address/0');

    // second dependent info
    client.waitForElementVisible('label[for="root_childPlaceOfBirth"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeDependentInfo(client, testData.data, 1);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/dependents/children/information/1');

    // second dependent address info
    client.waitForElementVisible('label[for="root_childInHousehold"]', Timeouts.normal);
    client.assert.cssClassPresent('.progress-bar-segmented div.progress-segment:nth-child(1)', 'progress-segment-complete');
    PageHelpers.completeDependentAddressInfo(client, testData.data, 1);
    client.axeCheck('.main')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/dependents/children/address/0');

    // Financial disclosure page

    // Additional Information page

    // Document Upload page
    client.end();
  }
);

if (process.env.BUILDTYPE !== 'production') {
  module.exports = runTest;
}
