const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const manifest = require('../../manifest.json');
const testData = require('./686-test-data.json');

import * as TestHelpers from './test-helpers';

const runTest = E2eHelpers.createE2eTest(client => {
  const token = Auth.getUserToken();
  TestHelpers.initApplicationSubmitMock(token);
  TestHelpers.initValidVaFileNumberMock(token).then();
  // Login
  Auth.logIn(
    token,
    client,
    '/view-change-dependents/add-remove-form-686c',
    3,
  ).waitForElementVisible('.process.schemaform-process', Timeouts.verySlow);
  client.waitForElementVisible(
    '.usa-alert.usa-alert-info.schemaform-sip-alert',
    Timeouts.verySlow,
  );
  client.click('.usa-button-primary.va-button-primary.schemaform-start-button');

  // select options
  E2eHelpers.expectLocation(client, '/686-options-selection');
  client.axeCheck('.main');
  TestHelpers.select686Options(
    client,
    ['addChild', 'reportDivorce'],
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

  // previous spouse information and location of divorce
  E2eHelpers.expectLocation(client, '/report-a-divorce');
  client.waitForElementVisible(
    '#root_reportDivorce_fullName_first',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillReportDivorceSpouseInformation(client, testData.data);
  TestHelpers.fillReportDivorceLocationOfDivorce(client, testData.data);
  TestHelpers.fillReportDivorceReasonMarriageEnded(client, testData.data);
  client.click('button[id="4-continueButton"]');

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
  client.end();
});

module.exports = runTest;

// TODO: Remove this when CI builds temporary landing pages to run e2e tests
module.exports['@disabled'] = manifest.e2eTestsDisabled;
