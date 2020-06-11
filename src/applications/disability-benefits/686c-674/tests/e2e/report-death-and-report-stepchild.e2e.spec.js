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
    ['reportDeath', 'reportStepchildNotInHousehold'],
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

  // Deceased dependent info
  E2eHelpers.expectLocation(client, '/686-report-dependent-death');
  client.waitForElementVisible(
    '#root_deaths_0_fullName_first',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.fill('input#root_deaths_0_fullName_first', 'John');
  client.fill('input#root_deaths_0_fullName_last', 'Doe');
  client.selectRadio('root_deaths_0_dependentType', 'SPOUSE');
  client.click('button[id="4-continueButton"]');

  // Deceased dependent additional info
  E2eHelpers.expectLocation(
    client,
    '686-report-dependent-death/0/additional-information',
  );
  client.waitForElementVisible('#root_location_state', Timeouts.normal);
  client.axeCheck('.main');
  client.selectDropdown('root_dateMonth', '1');
  client.selectDropdown('root_dateDay', '1');
  client.fill('input#root_dateYear', '2019');
  client.fill('input#root_location_state', 'California');
  client.fill('input#root_location_city', 'Someplace');
  client.click('button[id="4-continueButton"]');

  // Stepchild info
  E2eHelpers.expectLocation(
    client,
    '/686-stepchild-no-longer-part-of-household',
  );
  client.waitForElementVisible(
    '#root_stepChildren_0_fullName_first',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.fill('input#root_stepChildren_0_fullName_first', 'John');
  client.fill('input#root_stepChildren_0_fullName_last', 'Doe');
  client.click('button[id="4-continueButton"]');

  // Stepchild additional info
  E2eHelpers.expectLocation(
    client,
    '686-stepchild-no-longer-part-of-household/0',
  );
  client.waitForElementVisible(
    '#root_whoDoesTheStepchildLiveWith_first',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.selectRadio('root_supportingStepchild', 'Y');
  client.fill('input#root_whoDoesTheStepchildLiveWith_first', 'John');
  client.fill('input#root_whoDoesTheStepchildLiveWith_last', 'Doe');
  client.selectDropdown('root_address_countryName', 'USA');
  client.fill('input#root_address_addressLine1', '101 sompleace lane');
  client.fill('input#root_address_addressLine1', '101 sompleace lane');
  client.fill('input#root_address_city', 'Someplace');
  client.selectDropdown('root_address_stateCode', 'CA');
  client.fill('input#root_address_zipCode', '12345');
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
