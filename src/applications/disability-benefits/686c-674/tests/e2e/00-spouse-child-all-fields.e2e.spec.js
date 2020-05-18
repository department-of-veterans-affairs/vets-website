const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const manifest = require('../../manifest.json');
const testData = require('./686-test-data.json');
const environments = require('site/constants/environments');

import * as TestHelpers from './test-helpers';

const runTest = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();
  TestHelpers.initApplicationSubmitMock(token);
  // Login
  Auth.logIn(
    token,
    client,
    '/view-change-dependents/add-remove-form-686c',
    3,
  ).waitForElementVisible('.process.schemaform-process', Timeouts.verySlow);
  client.click('.usa-button-primary.va-button-primary.schemaform-start-button');

  // select options
  E2eHelpers.expectLocation(client, '/686-options-selection');
  client.axeCheck('.main');
  TestHelpers.select686Options(
    client,
    ['addChild', 'addSpouse'],
    testData.data,
  );
  client.click('button[id="4-continueButton"]');

  // veteran information
  E2eHelpers.expectLocation(client, '/veteran-information');
  client.axeCheck('.main');
  client.click('button[id="4-continueButton"]');

  // veteran address
  E2eHelpers.expectLocation(client, '/veteran-address');
  client.axeCheck('.main');
  TestHelpers.fillVeteranDomesticAddress(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // child information
  E2eHelpers.expectLocation(client, '/add-child');
  client.axeCheck('.main');
  TestHelpers.fillChildNameInformation(client, testData.data, 0);
  client.click('.va-growable button.usa-button-secondary.va-growable-add-btn');
  TestHelpers.fillChildNameInformation(client, testData.data, 1);
  client.click('button[id="4-continueButton"]');

  // child 1 place of birth and status
  E2eHelpers.expectLocation(client, '/add-child/0');
  client.axeCheck('.main');
  TestHelpers.fillChildPlaceOfBirthAndStatusInformation(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // child 1 current living location
  E2eHelpers.expectLocation(client, '/add-child/0/additional-information');
  client.waitForElementVisible(
    '#root_doesChildLiveWithYou-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillChildAddressStatus(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // child 2 place of birth and status
  E2eHelpers.expectLocation(client, '/add-child/1');
  client.axeCheck('.main');
  TestHelpers.fillChildPlaceOfBirthAndStatusInformation(
    client,
    testData.data,
    true,
  );
  client.click('button[id="4-continueButton"]');

  // child 2 living location - lives with another person
  E2eHelpers.expectLocation(client, '/add-child/1/additional-information');
  client.waitForElementVisible(
    '#root_doesChildLiveWithYou-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillChildAddressStatus(client, testData.data, false);
  client.click('button[id="4-continueButton"]');

  // spouse information
  E2eHelpers.expectLocation(client, '/add-spouse');
  client.waitForElementVisible(
    '#root_spouseInformation_fullName_first-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillSpousePersonalInformation(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // current marriage information
  E2eHelpers.expectLocation(client, '/current-marriage-information');
  client.waitForElementVisible(
    '#root_currentMarriageInformation_date-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillCurrentMarriageInformation(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // current spouse address
  E2eHelpers.expectLocation(client, '/current-marriage-address');
  client.waitForElementVisible(
    '#root_doesLiveWithSpouse_spouseDoesLiveWithVeteran-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillSpouseAddressInformation(client, testData.data, false);
  client.click('button[id="4-continueButton"]');

  // current spouse marriage history
  E2eHelpers.expectLocation(client, '/current-spouse-marriage-history');
  client.waitForElementVisible(
    '#root_spouseWasMarriedBefore-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.pause(Timeouts.normal);
  TestHelpers.fillSpouseMarriageHistory(client, testData.data, true);
  client.click('button[id="4-continueButton"]');

  // spouse marriage history details
  client.pause(Timeouts.normal);
  client.waitForElementVisible('#root_startDate-label', Timeouts.normal);
  E2eHelpers.expectLocation(client, '/current-spouse-marriage-history/0');
  client.axeCheck('.main');
  TestHelpers.fillSpouseMarriageHistoryDetails(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // veteran marriage history
  E2eHelpers.expectLocation(client, '/veteran-marriage-history');
  client.waitForElementVisible(
    '#root_veteranWasMarriedBefore-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.pause(Timeouts.normal);
  TestHelpers.fillVeteranMarriageHistory(client, testData.data, true);
  client.click('button[id="4-continueButton"]');

  // veteran marriage history details
  E2eHelpers.expectLocation(client, '/veteran-marriage-history/0');
  client.waitForElementVisible('#root_startDate-label', Timeouts.normal);
  TestHelpers.fillVeteranMarriageHistoryDetails(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // marriage additional evidence
  E2eHelpers.expectLocation(client, '/add-spouse-evidence');
  client.waitForElementVisible(
    '#root_supportingDocuments_add_label',
    Timeouts.normal,
  );
  client.pause(Timeouts.normal);
  client.click(
    '.row.form-progress-buttons.schemaform-buttons div.small-6.medium-5.end.columns button.usa-button-primary',
  );

  // review page
  E2eHelpers.expectLocation(client, '/review-and-submit');
  client.waitForElementVisible(
    '.usa-accordion-bordered.form-review-panel',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.assert.cssClassPresent(
    '.progress-bar-segmented div.progress-segment:nth-child(5)',
    'progress-segment-complete',
  );
  // privacy agreement
  client.waitForElementVisible(
    'label[name="privacyAgreementAccepted-label"]',
    Timeouts.normal,
  );
  client.click('.form-checkbox input[name="privacyAgreementAccepted"]');
  client.click('.form-progress-buttons .usa-button-primary');
  E2eHelpers.expectLocation(client, '/confirmation');

  // confirmation
  client.axeCheck('.main');
  client.end();
});

module.exports = runTest;

// TODO: Remove this when CI builds temporary landing pages to run e2e tests
module.exports['@disabled'] =
  manifest.e2eTestsDisabled && process.env.BUILDTYPE !== environments.LOCALHOST;
