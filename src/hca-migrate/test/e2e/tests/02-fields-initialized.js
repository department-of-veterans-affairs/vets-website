const request = require('request');

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

function expectValueToBeBlank(client, field) {
  client.expect.element(field).to.have.value.that.equals('');
}

function expectInputToNotBeSelected(client, field) {
  client.expect.element(field).to.not.be.selected;
}

module.exports = {
  'Begin application': (client) => {
    console.log(url);
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
    expectValueToBeBlank(client, 'input[name="fname"]');
    expectValueToBeBlank(client, 'input[name="mname"]');
    expectValueToBeBlank(client, 'input[name="lname"]');
    expectValueToBeBlank(client, 'select[name="suffix"]');
    expectValueToBeBlank(client, 'input[name="mothersMaidenName"]');
    common.completePersonalInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    expectValueToBeBlank(client, 'select[name="veteranBirthMonth"]');
    expectValueToBeBlank(client, 'select[name="veteranBirthDay"]');
    expectValueToBeBlank(client, 'input[name="veteranBirthYear"]');
    expectValueToBeBlank(client, 'input[name="ssn"]');
    expectValueToBeBlank(client, 'input[name="cityOfBirth"]');
    expectValueToBeBlank(client, 'select[name="stateOfBirth"]');
    common.completeBirthInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    expectValueToBeBlank(client, 'select[name="gender"]');
    expectInputToNotBeSelected(client, 'input[name="isAmericanIndianOrAlaskanNative"]');
    expectInputToNotBeSelected(client, 'input[name="isBlackOrAfricanAmerican"]');
    expectInputToNotBeSelected(client, 'input[name="isNativeHawaiianOrOtherPacificIslander"]');
    expectInputToNotBeSelected(client, 'input[name="isAsian"]');
    expectInputToNotBeSelected(client, 'input[name="isWhite"]');
    expectInputToNotBeSelected(client, 'input[name="isSpanishHispanicLatino"]');
    common.completeDemographicInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    expectValueToBeBlank(client, 'input[name="address"]');
    expectValueToBeBlank(client, 'input[name="city"]');
    expectValueToBeBlank(client, 'select[name="country"]');
    expectValueToBeBlank(client, 'input[name="province"]');
    expectValueToBeBlank(client, 'input[name="postalCode"]');
    client.expect.element('select[name="state"]').not.to.be.present;
    client.expect.element('input[name="zip"]').not.to.be.present;
    common.completeVeteranAddress(client, common.testValues, true);
    client.expect.element('select[name="state"]').to.be.visible;
    client.expect.element('input[name="zip"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    expectValueToBeBlank(client, 'input.first-email');
    expectValueToBeBlank(client, 'input.second-email');
    expectValueToBeBlank(client, 'input.home-phone');
    expectValueToBeBlank(client, 'input.mobile-phone');
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    expectValueToBeBlank(client, 'select[name="lastServiceBranch"]');
    expectValueToBeBlank(client, 'select[name="lastEntryMonth"]');
    expectValueToBeBlank(client, 'select[name="lastEntryDay"]');
    expectValueToBeBlank(client, 'input[name="lastEntryYear"]');
    expectValueToBeBlank(client, 'select[name="lastDischargeMonth"]');
    expectValueToBeBlank(client, 'select[name="lastDischargeDay"]');
    expectValueToBeBlank(client, 'input[name="lastDischargeYear"]');
    expectValueToBeBlank(client, 'select[name="dischargeType"]');
    common.completeMilitaryService(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="purpleHeartRecipient"]');
    expectInputToNotBeSelected(client, 'input[name="isFormerPow"]');
    expectInputToNotBeSelected(client, 'input[name="postNov111998Combat"]');
    expectInputToNotBeSelected(client, 'input[name="disabledInLineOfDuty"]');
    expectInputToNotBeSelected(client, 'input[name="swAsiaCombat"]');
    expectInputToNotBeSelected(client, 'input[name="vietnamService"]');
    expectInputToNotBeSelected(client, 'input[name="exposedToRadiation"]');
    expectInputToNotBeSelected(client, 'input[name="radiumTreatments"]');
    expectInputToNotBeSelected(client, 'input[name="campLejeune"]');
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="compensableVaServiceConnected-0"]');
    expectInputToNotBeSelected(client, 'input[name="compensableVaServiceConnected-1"]');
    expectInputToNotBeSelected(client, 'input[name="isVaServiceConnected-0"]');
    expectInputToNotBeSelected(client, 'input[name="isVaServiceConnected-1"]');
    expectInputToNotBeSelected(client, 'input[name="receivesVaPension-0"]');
    expectInputToNotBeSelected(client, 'input[name="receivesVaPension-1"]');
    common.completeVaBenefits(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="understandsFinancialDisclosure"] + label').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="understandsFinancialDisclosure"]');
    common.completeFinancialDisclosure(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('select[name="maritalStatus"]').to.be.visible;
    expectValueToBeBlank(client, 'select[name="maritalStatus"]');
    client
      .setValue('select[name="maritalStatus"]', 'Married')
      .click('.form-panel');

    client.expect.element('input[name="fname"]').to.be.visible.before(common.timeouts.normal);
    expectValueToBeBlank(client, 'input[name="fname"]');
    expectValueToBeBlank(client, 'input[name="mname"]');
    expectValueToBeBlank(client, 'input[name="lname"]');
    expectValueToBeBlank(client, 'select[name="suffix"]');
    expectValueToBeBlank(client, 'input[name="ssn"]');
    expectValueToBeBlank(client, 'select[name="spouseBirthMonth"]');
    expectValueToBeBlank(client, 'select[name="spouseBirthDay"]');
    expectValueToBeBlank(client, 'input[name="spouseBirthYear"]');
    expectValueToBeBlank(client, 'select[name="marriageMonth"]');
    expectValueToBeBlank(client, 'select[name="marriageDay"]');
    expectValueToBeBlank(client, 'input[name="marriageYear"]');
    expectInputToNotBeSelected(client, 'input[name="sameAddress-0"]');
    expectInputToNotBeSelected(client, 'input[name="sameAddress-1"]');

    client.click('input[name="sameAddress-1"]');
    client.expect.element('input[name="address"]').to.be.visible.before(common.timeouts.normal);
    expectValueToBeBlank(client, 'input[name="address"]');
    expectValueToBeBlank(client, 'input[name="city"]');
    expectValueToBeBlank(client, 'select[name="country"]');
    expectValueToBeBlank(client, 'input[name="province"]');
    expectValueToBeBlank(client, 'input[name="postalCode"]');
    client.expect.element('select[name="state"]').not.to.be.present;
    client.expect.element('input[name="zip"]').not.to.be.present;

    client.click('input[name="cohabitedLastYear-1"]');
    expectInputToNotBeSelected(client, 'input[name="provideSupportLastYear-0"]');
    expectInputToNotBeSelected(client, 'input[name="provideSupportLastYear-1"]');
    common.completeSpouseInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/spouse-information');

    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="hasChildrenToReport-0"]');
    expectInputToNotBeSelected(client, 'input[name="hasChildrenToReport-1"]');

    client.click('input[name="hasChildrenToReport-0"]');
    expectValueToBeBlank(client, 'input[name="fname"]');
    expectValueToBeBlank(client, 'input[name="mname"]');
    expectValueToBeBlank(client, 'input[name="lname"]');
    expectValueToBeBlank(client, 'select[name="suffix"]');
    expectValueToBeBlank(client, 'select[name="childRelation"]');
    expectValueToBeBlank(client, 'input[name="ssn"]');
    expectValueToBeBlank(client, 'select[name="childBirthMonth"]');
    expectValueToBeBlank(client, 'select[name="childBirthDay"]');
    expectValueToBeBlank(client, 'input[name="childBirthYear"]');
    expectValueToBeBlank(client, 'select[name="childBecameDependentMonth"]');
    expectValueToBeBlank(client, 'select[name="childBecameDependentDay"]');
    expectValueToBeBlank(client, 'input[name="childBecameDependentYear"]');
    expectInputToNotBeSelected(client, 'input[name="childDisabledBefore18-0"]');
    expectInputToNotBeSelected(client, 'input[name="childDisabledBefore18-1"]');
    expectInputToNotBeSelected(client, 'input[name="childAttendedSchoolLastYear-0"]');
    expectInputToNotBeSelected(client, 'input[name="childAttendedSchoolLastYear-1"]');
    expectValueToBeBlank(client, 'input[name="childEducationExpenses"]');
    expectInputToNotBeSelected(client, 'input[name="childCohabitedLastYear-0"]');
    expectInputToNotBeSelected(client, 'input[name="childCohabitedLastYear-1"]');

    client.click('input[name="childCohabitedLastYear-1"]');
    expectInputToNotBeSelected(client, 'input[name="childReceivedSupportLastYear-0"]');
    expectInputToNotBeSelected(client, 'input[name="childReceivedSupportLastYear-1"]');

    common.completeChildInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    expectValueToBeBlank(client, 'input[name="veteranGrossIncome"]');
    expectValueToBeBlank(client, 'input[name="veteranNetIncome"]');
    expectValueToBeBlank(client, 'input[name="veteranOtherIncome"]');
    expectValueToBeBlank(client, 'input[name="spouseGrossIncome"]');
    expectValueToBeBlank(client, 'input[name="spouseNetIncome"]');
    expectValueToBeBlank(client, 'input[name="spouseOtherIncome"]');
    expectValueToBeBlank(client, 'input[name="childGrossIncome"]');
    expectValueToBeBlank(client, 'input[name="childNetIncome"]');
    expectValueToBeBlank(client, 'input[name="ChildOtherIncome"]');
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    expectValueToBeBlank(client, 'input[name="deductibleMedicalExpenses"]');
    expectValueToBeBlank(client, 'input[name="deductibleFuneralExpenses"]');
    expectValueToBeBlank(client, 'input[name="deductibleEducationExpenses"]');
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="isMedicaidEligible-0"]');
    expectInputToNotBeSelected(client, 'input[name="isMedicaidEligible-1"]');
    expectInputToNotBeSelected(client, 'input[name="isEnrolledMedicarePartA-0"]');
    expectInputToNotBeSelected(client, 'input[name="isEnrolledMedicarePartA-1"]');

    client.click('input[name="isEnrolledMedicarePartA-0"]');

    expectValueToBeBlank(client, 'select[name="medicarePartAEffectiveMonth"]');
    expectValueToBeBlank(client, 'select[name="medicarePartAEffectiveDay"]');
    expectValueToBeBlank(client, 'input[name="medicarePartAEffectiveYear"]');
    common.completeMedicareAndMedicaid(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="isCoveredByHealthInsurance-0"]');
    expectInputToNotBeSelected(client, 'input[name="isCoveredByHealthInsurance-1"]');

    client.click('input[name="isCoveredByHealthInsurance-0"]');
    expectValueToBeBlank(client, 'input[name="insuranceName"]');
    expectValueToBeBlank(client, 'input[name="insurancePolicyHolderName"]');
    expectValueToBeBlank(client, 'input[name="insurancePolicyNumber"]');
    expectValueToBeBlank(client, 'input[name="insuranceGroupCode"]');
    common.completeInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    expectInputToNotBeSelected(client, 'input[name="isEssentialAcaCoverage"]');
    expectValueToBeBlank(client, 'select[name="state"]');
    expectValueToBeBlank(client, 'select[name="vaMedicalFacility"]');
    expectInputToNotBeSelected(client, 'input[name="wantsInitialVaContact-0"]');
    expectInputToNotBeSelected(client, 'input[name="wantsInitialVaContact-1"]');
    common.completeVaInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    // expectNavigateAwayFrom(client, '/review-and-submit');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(common.timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;

    client.end();
  },
  tearDown: report
};
