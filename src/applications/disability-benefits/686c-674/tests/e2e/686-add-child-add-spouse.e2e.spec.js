const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const manifest = require('../../manifest.json');
const testData = require('./686-test-data.json');

const runTest = E2eHelpers.createE2eTest(client => {
  // Login
  const token = Auth.getUserToken();
  Auth.logIn(
    token,
    client,
    '/disability-benefits/new-686/686-options-selection',
  ).waitForElementVisible('.schemaform-widget-wrapper', Timeouts.verySlow);

  // select options
  client.fillCheckbox(
    'input[name="root_view:selectable686Options_addChild"]',
    testData.data.optionsSelection.addChild,
  );
  client.fillCheckbox(
    'input[name="root_view:selectable686Options_addSpouse"]',
    testData.data.optionsSelection.addSpouse,
  );
  client.click('button[id="2-continueButton"]');
  // fill out veteran information
  client
    .fill(
      'input[name="root_first"]',
      testData.data.veteranInformation.firstName,
    )
    .fill('input[name="root_last"]', testData.data.veteranInformation.lastName)
    .fill('input[name="root_ssn"]', testData.data.veteranInformation.ssn)
    .selectDropdown(
      'root_birthDateMonth',
      testData.data.veteranInformation.dobMonth,
    )
    .selectDropdown(
      'root_birthDateDay',
      testData.data.veteranInformation.dobDay,
    )
    .fill(
      'input[name="root_birthDateYear"]',
      testData.data.veteranInformation.dobYear,
    );
  client.click('button[id="2-continueButton"]');
  // fill out veteran address
  client
    .selectDropdown(
      'root_veteranAddress_countryName',
      testData.data.veteranAddress.countryName,
    )
    .fill(
      'input[name="root_veteranAddress_addressLine1"]',
      testData.data.veteranAddress.addressLine1,
    )
    .fill(
      'input[name="root_veteranAddress_city"]',
      testData.data.veteranAddress.city,
    )
    .selectDropdown(
      'root_veteranAddress_stateCode',
      testData.data.veteranAddress.stateCode,
    )
    .fill(
      'input[name="root_veteranAddress_zipCode"]',
      testData.data.veteranAddress.zipCode,
    )
    .fill(
      'input[name="root_phoneNumber"]',
      testData.data.veteranAddress.phoneNumber,
    );
  client.pause(Timeouts.verySlow);
  client.end();
});

module.exports = runTest;
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
