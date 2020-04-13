const Auth = require('platform/testing/e2e/auth');
const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const manifest = require('../../manifest.json');
const testData = require('./686-test-data.json');

import * as TestHelpers from './test-helpers';

const runTest = E2eHelpers.createE2eTest(client => {
  TestHelpers.initDocumentUploadMock();
  TestHelpers.initApplicationSubmitMock();
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
  TestHelpers.fillChildNameInformation(client, testData.data, 0);
  client.click('.va-growable button.usa-button-secondary.va-growable-add-btn');
  TestHelpers.fillChildNameInformation(client, testData.data, 1);
  client.click('button[id="2-continueButton"]');

  // child 1 place of birth and status
  E2eHelpers.expectLocation(client, '/add-child/0');
  client.axeCheck('.main');
  TestHelpers.fillChildPlaceOfBirthAndStatusInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // child 1 current living location
  E2eHelpers.expectLocation(client, '/add-child/0/additional-information');
  client.waitForElementVisible(
    '#root_doesChildLiveWithYou-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillChildAddressStatus(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // child 2 place of birth and status
  E2eHelpers.expectLocation(client, '/add-child/1');
  client.axeCheck('.main');
  TestHelpers.fillChildPlaceOfBirthAndStatusInformation(
    client,
    testData.data,
    true,
  );
  client.click('button[id="2-continueButton"]');
  // child 2 living location - lives with another person
  E2eHelpers.expectLocation(client, '/add-child/1/additional-information');
  client.waitForElementVisible(
    '#root_doesChildLiveWithYou-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  // Not sure why but this element doesn't get clicked unless there's a pause before interaction.
  client.pause(Timeouts.normal);
  TestHelpers.fillChildAddressStatus(client, testData.data, false);
  client.click('button[id="2-continueButton"]');

  // spouse information
  E2eHelpers.expectLocation(client, '/add-spouse');
  client.waitForElementVisible(
    '#root_spouseFullName_first-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillSpousePersonalInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // current marriage information
  E2eHelpers.expectLocation(client, '/current-marriage-information');
  client.waitForElementVisible('#root_dateOfMarriage-label', Timeouts.normal);
  client.axeCheck('.main');
  TestHelpers.fillCurrentMarriageInformation(client, testData.data);
  client.click('button[id="2-continueButton"]');
  // current spouse address
  E2eHelpers.expectLocation(client, '/current-marriage-address');
  client.waitForElementVisible(
    '#root_spouseDoesLiveWithVeteran-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.pause(Timeouts.normal);
  TestHelpers.fillSpouseAddressInformation(client, testData.data, false);
  client.click('button[id="2-continueButton"]');

  // current spouse marriage history
  E2eHelpers.expectLocation(client, '/current-spouse-marriage-history');
  client.waitForElementVisible(
    '#root_spouseWasMarriedBefore-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.pause(Timeouts.normal);
  TestHelpers.fillSpouseMarriageHistory(client, testData.data, true);
  client.click('button[id="2-continueButton"]');
  // spouse marriage history details
  E2eHelpers.expectLocation(client, '/current-spouse-marriage-history/0');
  client.waitForElementVisible(
    '#root_marriageStartDate-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  TestHelpers.fillSpouseMarriageHistoryDetails(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // veteran marriage history
  E2eHelpers.expectLocation(client, '/veteran-marriage-history');
  client.waitForElementVisible(
    '#root_veteranWasMarriedBefore-label',
    Timeouts.normal,
  );
  client.axeCheck('.main');
  client.pause(Timeouts.normal);
  TestHelpers.fillVeteranMarriageHistory(client, testData.data, true);
  client.click('button[id="2-continueButton"]');
  // veteran marriage history details
  E2eHelpers.expectLocation(client, '/veteran-marriage-history/0');
  client.waitForElementVisible(
    '#root_marriageStartDate-label',
    Timeouts.normal,
  );
  TestHelpers.fillVeteranMarriageHistoryDetails(client, testData.data);
  client.click('button[id="2-continueButton"]');

  // marriage additional evidence
  E2eHelpers.expectLocation(client, '/add-spouse-evidence');
  client.waitForElementVisible(
    '#root_supportingDocuments_add_label',
    Timeouts.normal,
  );
  // E2eHelpers.uploadTestFile(client, testData.data.testUploadFile);
  // client.waitForElementVisible(
  //   'input#root_attachments_0_attachmentName',
  //   Timeouts.slow,
  // );
  // client.expect
  //   .element('input#root_attachments_0_attachmentName')
  //   .to.have.value.that.equals(testData.data.testUploadFile.fileName);
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
  client.end();
});

module.exports = runTest;
module.exports['@disabled'] =
  manifest.template[process.env.BUILDTYPE] === false;
