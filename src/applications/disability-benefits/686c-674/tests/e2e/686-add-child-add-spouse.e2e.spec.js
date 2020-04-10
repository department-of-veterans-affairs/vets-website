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
  TestHelpers.select686Options(
    client,
    ['addChild', 'addSpouse'],
    testData.data,
  );
  client.click('button[id="2-continueButton"]');

  // fill out veteran information
  TestHelpers.fillVeteranData(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // fill out veteran address
  TestHelpers.fillVeteranDomesticAddress(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // fill out child information
  TestHelpers.fillChildNameInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  TestHelpers.fillChildPlaceOfBirthAndStatusInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  TestHelpers.fillChildAddressStatus(client, testData.data);
  TestHelpers.fillChildAddressStatus(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // fill out spouse information
  TestHelpers.fillSpousePersonalInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  TestHelpers.fillCurrentMarriageInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  TestHelpers.fillSpouseAddressInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  TestHelpers.fillSpouseMarriageHistory(client, testData.data);
  client.click('button[id="2-continueButton"]');
  TestHelpers.fillVeteranMarriageHistory(client, testData.data);
  client.end();
});

module.exports = runTest;
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
