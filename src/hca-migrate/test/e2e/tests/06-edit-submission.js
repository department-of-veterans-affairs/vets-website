const request = require('request');
const _ = require('lodash');

const report = require('../report');
const config = require('../../../config');

// FIXME: This should come in from a config variable
const url = 'http://localhost:' + config.port; // eslint-disable-line

const common = require('../utils/common.js');

// TODO(awong): Move this into a custom command or assertion that can be used with client.expect.element().
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain(urlSubstring).before(common.timeouts.normal);
}

function editSection(client) {
  client.useXpath().click('(//button[text()="Edit"])[last()]').useCss();
}

function nextSection(client) {
  client.useXpath().click('//button[text()="Next"]').useCss();
}

function verifyEdit(client, expectedValue) {
  client.click('.usa-button-outline');
  client.expect.element('.review tr:nth-child(1) td:nth-child(2)').text.to.equal(expectedValue);
  nextSection(client);
}

module.exports = {
  'Begin application': (client) => {
    request({
      uri: `${url}/api/hca/v1/mock`,
      method: 'POST',
      json: {
        resource: 'application',
        verb: 'post',
        value: {
          formSubmissionId: '123fake-submission-id-567',
          timeStamp: '2016-05-16'
        }
      }
    });

    // Ensure introduction page renders.
    client
      .url(url)
      .waitForElementVisible('body', common.timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', common.timeouts.slow)  // First render of React may be slow.
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    client.expect.element('input[name="fname"]').to.be.visible;
    common.completePersonalInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    common.completeBirthInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    common.completeDemographicInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    common.completeVeteranAddress(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    common.completeMilitaryService(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    common.completeVaBenefits(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="understandsFinancialDisclosure"] + label').to.be.visible;
    common.completeFinancialDisclosure(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('select[name="maritalStatus"]').to.be.visible;
    common.completeSpouseInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/spouse-information');

    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    common.completeChildInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    common.completeMedicareAndMedicaid(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    common.completeInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    common.completeVaInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;

    // create copy obj so that all defaults remain except what we explicitly change
    const vetInfoCopy = _.cloneDeep(common.testValues);

    // TODO: investigate issue with clearing/setting year fields
    // currently, setting a year after clearing removing the second number, eg. 1980 becomes 180
    // setting it to blank clears it and fills in with the original value
    // leaving for now as may be a bug, this test gets us the desired e2e test (can edit in final step and save)


    // Edit personal info
    vetInfoCopy.veteranFullName = {
      first: 'John',
      last: 'Doe'
    };
    editSection(client);
    common.completePersonalInformation(client, vetInfoCopy, true);
    verifyEdit(client, 'John Doe');

    // Edit birth info
    vetInfoCopy.veteranDateOfBirth = {
      month: 'Jan',
      day: '20',
      year: ''
    };
    editSection(client);
    client.clearValue('input[name="veteranBirthYear"]');
    common.completeBirthInformation(client, vetInfoCopy, true);
    verifyEdit(client, '1/20/1980');

    // Edit demographic info
    vetInfoCopy.gender = 'F';
    editSection(client);
    common.completeDemographicInformation(client, vetInfoCopy, true);
    verifyEdit(client, 'F');

    // Edit address
    vetInfoCopy.veteranAddress.street = '123 Foo St.';
    editSection(client);
    client.clearValue('input[name="address"]');
    common.completeVeteranAddress(client, vetInfoCopy, true);
    verifyEdit(client, '123 Foo St.');

    nextSection(client);

    // Edit service branch
    vetInfoCopy.lastServiceBranch = 'coast guard';
    vetInfoCopy.lastDischargeDate.year = '';
    vetInfoCopy.lastEntryDate.year = '';
    editSection(client);
    common.completeMilitaryService(client, vetInfoCopy, true);
    verifyEdit(client, 'Coast Guard');

    nextSection(client);
    nextSection(client);
    nextSection(client);

    // Edit spouse information
    vetInfoCopy.maritalStatus = 'Separated';
    vetInfoCopy.dateOfMarriage.year = '';
    vetInfoCopy.spouseDateOfBirth.year = '';
    editSection(client);
    common.completeSpouseInformation(client, vetInfoCopy, true);
    verifyEdit(client, 'Separated');

    client.click('.form-panel .usa-button-primary');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(common.timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;


    client.end();
  },
  tearDown: report
};
