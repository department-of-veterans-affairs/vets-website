const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const manifest = require('../../manifest.json');
const testData = require('./686-test-data.json');

import * as TestHelpers from './test-helpers';

const runTest = E2eHelpers.createE2eTest(client => {
  // Login
  const token = Auth.getUserToken();
  Auth.logIn(
    token,
    client,
    '/disability-benefits/new-686/686-options-selection',
  ).waitForElementVisible('.schemaform-widget-wrapper', Timeouts.verySlow);

  // select options
  E2eHelpers.expectLocation(client, '/686-options-selection');
  client.axeCheck('.main');
  TestHelpers.select686Options(
    client,
    ['addChild', 'addSpouse'],
    testData.data,
  );
  client.click('button[id="2-continueButton"]');

  // veteran information
  E2eHelpers.expectLocation(client, '/veteran-information');
  client.axeCheck('.main');
  TestHelpers.fillVeteranData(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // veteran address
  E2eHelpers.expectLocation(client, '/veteran-address');
  client.axeCheck('.main');
  TestHelpers.fillVeteranDomesticAddress(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // child information
  E2eHelpers.expectLocation(client, '/add-child');
  client.axeCheck('.main');
  TestHelpers.fillChildNameInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // child place of birth and status
  E2eHelpers.expectLocation(client, '/add-child/0');
  client.axeCheck('.main');
  TestHelpers.fillChildPlaceOfBirthAndStatusInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // child current living location
  E2eHelpers.expectLocation(client, '/add-child/0/additional-information');
  client.axeCheck('.main');
  TestHelpers.fillChildAddressStatus(client, testData.data);
  TestHelpers.fillChildAddressStatus(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // spouse information
  E2eHelpers.expectLocation(client, '/add-spouse');
  client.axeCheck('.main');
  TestHelpers.fillSpousePersonalInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // current marriage information
  E2eHelpers.expectLocation(client, '/current-marriage-information');
  client.axeCheck('.main');
  TestHelpers.fillCurrentMarriageInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // current spouse address
  E2eHelpers.expectLocation(client, '/current-marriage-address');
  client.axeCheck('.main');
  TestHelpers.fillSpouseAddressInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // current spouse marriage history
  E2eHelpers.expectLocation(client, '/current-spouse-marriage-history');
  client.axeCheck('.main');
  TestHelpers.fillSpouseMarriageHistory(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // veteran marriage history
  E2eHelpers.expectLocation(client, '/veteran-marriage-history');
  client.axeCheck('.main');
  TestHelpers.fillVeteranMarriageHistory(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // review page
  client.axeCheck('.main');
  client.assert.cssClassPresent(
    '.progress-bar-segmented div.progress-segment:nth-child(5)',
    'progress-segment-complete',
  );
  // privacy agreement
  client.end();
});

module.exports = runTest;
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
