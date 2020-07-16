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
    [
      'reportDeath',
      'reportStepchildNotInHousehold',
      'reportMarriageOfChildUnder18',
      'reportChild18OrOlderIsNotAttendingSchool',
    ],
    testData.data,
  );
  client.click('button[id="4-continueButton"]');

  // veteran information
  E2eHelpers.expectLocation(client, '/veteran-information');
  client.axeCheck('.main');
  client.pause(Timeouts.normal);
  client.click('button[id="4-continueButton"]');

  // veteran address
  E2eHelpers.expectLocation(client, '/veteran-address');
  client.axeCheck('.main');
  TestHelpers.fillVeteranDomesticAddress(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // report stepchild left household
  E2eHelpers.expectLocation(
    client,
    '/686-stepchild-no-longer-part-of-household',
  );
  client.axeCheck('.main');
  TestHelpers.fillStepchildName(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // report stepchild left household details
  E2eHelpers.expectLocation(
    client,
    '/686-stepchild-no-longer-part-of-household/0',
  );
  client.axeCheck('.main');
  TestHelpers.fillStepchildDetails(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // deceased name
  E2eHelpers.expectLocation(client, '/686-report-dependent-death');
  client.axeCheck('.main');
  TestHelpers.fillDeceasedName(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // deceased details
  E2eHelpers.expectLocation(
    client,
    '/686-report-dependent-death/0/additional-information',
  );
  client.axeCheck('.main');
  TestHelpers.fillDeceasedDetails(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // report child marriage
  E2eHelpers.expectLocation(client, '/686-report-marriage-of-child');
  client.axeCheck('.main');
  TestHelpers.fillChildMarriageDetails(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // report child stopped attending school
  E2eHelpers.expectLocation(client, '/report-child-stopped-attending-school');
  client.axeCheck('.main');
  TestHelpers.fillChildStoppedAttendingDetails(client, testData.data);
  client.click('button[id="4-continueButton"]');

  // review and submit
  E2eHelpers.expectLocation(client, '/review-and-submit');
  client.waitForElementVisible(
    '.usa-accordion-bordered.form-review-panel',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.assert.cssClassPresent(
    '.progress-bar-segmented div.progress-segment:nth-child(4)',
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
module.exports['@disabled'] =
  manifest.e2eTestsDisabled && process.env.BUILDTYPE !== environments.LOCALHOST;
