const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const PageHelpers = require('./686-helpers');
const testData = require('./schema/maximal-test.json');
const FormsTestHelpers = require('../../../../platform/testing/e2e/form-helpers');

const runTest = E2eHelpers.createE2eTest(client => {
  PageHelpers.initApplicationSubmitMock();

  if (process.env.BUILDTYPE !== 'production') {
    // Ensure introduction page renders.
    client
      .url(
        `${
          E2eHelpers.baseUrl
        }/disability-benefits/apply/dependents/form-686c-dependents`,
      )
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Declaration of status of dependents: Vets.gov')
      .waitForElementVisible('.schemaform-title', Timeouts.slow) // First render of React may be slow.
      .click('.usa-button-primary');

    E2eHelpers.overrideVetsGovApi(client);
    FormsTestHelpers.overrideFormsScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Veteran and claimant information page
    client.waitForElementVisible(
      'input[name="root_veteranFullName_first"]',
      Timeouts.normal,
    );
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(1)',
      'progress-segment-complete',
    );
    PageHelpers.completeVeteranInformation(client, testData.data);
    PageHelpers.completeClaimantInformation(client, testData.data);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information');

    // marriage information
    client.waitForElementVisible(
      'legend#root_maritalStatus-label',
      Timeouts.normal,
    );
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(2)',
      'progress-segment-complete',
    );
    PageHelpers.completeMarriageInformation(client, testData.data);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/marriage-info');

    // marriages
    testData.data.marriages.forEach((marriageData, index) => {
      client.waitForElementVisible('legend#root__title', Timeouts.normal);
      client.assert.cssClassPresent(
        '.progress-bar-segmented div.progress-segment:nth-child(2)',
        'progress-segment-complete',
      );
      PageHelpers.completeMarriage(client, marriageData);
      client.axeCheck('.main').click('.form-panel .usa-button-primary');
      E2eHelpers.expectNavigateAwayFrom(
        client,
        `/household/marriages/${index}`,
      );
    });

    // spouse info
    client.waitForElementVisible(
      'legend#root_spouseDateOfBirth-label',
      Timeouts.normal,
    );
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(3)',
      'progress-segment-complete',
    );
    PageHelpers.completeSpouseInformation(client, testData.data);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household/marriage-info');

    // spouse marriage
    client.waitForElementVisible('legend#root__title', Timeouts.normal);
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(3)',
      'progress-segment-complete',
    );
    PageHelpers.completeSpouseMarriageInformation(client, testData.data);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/spouse-info/marriages/0');

    // depenedents info
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(4)',
      'progress-segment-complete',
    );
    PageHelpers.completeDependentsInformation(client, testData.data);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');

    // dependent info
    client.waitForElementVisible(
      'input#root_childSocialSecurityNumber',
      Timeouts.normal,
    );
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(1)',
      'progress-segment-complete',
    );
    PageHelpers.completeDependentInfo(client, testData.data, 0);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(
      client,
      '/unmarried-children/information/0',
    );

    // dependent address info
    client.waitForElementVisible(
      'label[for="root_childInHouseholdYes"]',
      Timeouts.normal,
    );
    client.assert.cssClassPresent(
      '.progress-bar-segmented div.progress-segment:nth-child(1)',
      'progress-segment-complete',
    );
    PageHelpers.completeDependentAddressInfo(client, testData.data, 0);
    client.axeCheck('.main').click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(
      client,
      '/household/dependents/unmarried-children/address/0',
    );

    client.end();
  }
});

module.exports = runTest;
