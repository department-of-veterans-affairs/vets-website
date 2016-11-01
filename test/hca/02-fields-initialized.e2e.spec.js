const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const HcaHelpers = require('../util/hca-helpers.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    HcaHelpers.initApplicationSubmitMock();

    // Ensure introduction page renders.
    client
      .url(`${E2eHelpers.baseUrl}/healthcare/apply/application/`)
      .waitForElementVisible('body', Timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', Timeouts.slow)  // First render of React may be slow.
      .click('.form-panel .usa-button-primary');
    E2eHelpers.overrideVetsGovApi(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    client.expect.element('input[name="fname"]').to.be.visible;
    client.expect.element('input[name="fname"]').to.have.value.that.equals('');
    client.expect.element('input[name="mname"]').to.have.value.that.equals('');
    client.expect.element('input[name="lname"]').to.have.value.that.equals('');
    client.expect.element('select[name="suffix"]').to.have.value.that.equals('');
    client.expect.element('input[name="mothersMaidenName"]').to.have.value.that.equals('');
    HcaHelpers.completePersonalInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    client.expect.element('select[name="veteranBirthMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="veteranBirthDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="veteranBirthYear"]').to.have.value.that.equals('');
    client.expect.element('input[name="ssn"]').to.have.value.that.equals('');
    client.expect.element('input[name="cityOfBirth"]').to.have.value.that.equals('');
    client.expect.element('select[name="stateOfBirth"]').to.have.value.that.equals('');
    HcaHelpers.completeBirthInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    client.expect.element('select[name="gender"]').to.have.value.that.equals('');
    client.expect.element('input[name="isAmericanIndianOrAlaskanNative"]').to.not.be.selected;
    client.expect.element('input[name="isBlackOrAfricanAmerican"]').to.not.be.selected;
    client.expect.element('input[name="isNativeHawaiianOrOtherPacificIslander"]').to.not.be.selected;
    client.expect.element('input[name="isAsian"]').to.not.be.selected;
    client.expect.element('input[name="isWhite"]').to.not.be.selected;
    client.expect.element('input[name="isSpanishHispanicLatino"]').to.not.be.selected;
    HcaHelpers.completeDemographicInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    client.expect.element('input[name="address"]').to.have.value.that.equals('');
    client.expect.element('input[name="city"]').to.have.value.that.equals('');
    client.expect.element('select[name="country"]').to.have.value.that.equals('');
    client.expect.element('input[name="province"]').to.have.value.that.equals('');
    client.expect.element('input[name="postalCode"]').to.have.value.that.equals('');
    client.expect.element('select[name="state"]').not.to.be.present;
    client.expect.element('input[name="zip"]').not.to.be.present;
    HcaHelpers.completeVeteranAddress(client, HcaHelpers.testValues, true);
    client.expect.element('select[name="state"]').to.be.visible;
    client.expect.element('input[name="zip"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    client.expect.element('input.first-email').to.have.value.that.equals('');
    client.expect.element('input.second-email').to.have.value.that.equals('');
    client.expect.element('input.home-phone').to.have.value.that.equals('');
    client.expect.element('input.mobile-phone').to.have.value.that.equals('');
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    client.expect.element('select[name="lastServiceBranch"]').to.have.value.that.equals('');
    client.expect.element('select[name="lastEntryMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="lastEntryDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="lastEntryYear"]').to.have.value.that.equals('');
    client.expect.element('select[name="lastDischargeMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="lastDischargeDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="lastDischargeYear"]').to.have.value.that.equals('');
    client.expect.element('select[name="dischargeType"]').to.have.value.that.equals('');
    HcaHelpers.completeMilitaryService(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    client.expect.element('input[name="purpleHeartRecipient"]').to.not.be.selected;
    client.expect.element('input[name="isFormerPow"]').to.not.be.selected;
    client.expect.element('input[name="postNov111998Combat"]').to.not.be.selected;
    client.expect.element('input[name="disabledInLineOfDuty"]').to.not.be.selected;
    client.expect.element('input[name="swAsiaCombat"]').to.not.be.selected;
    client.expect.element('input[name="vietnamService"]').to.not.be.selected;
    client.expect.element('input[name="exposedToRadiation"]').to.not.be.selected;
    client.expect.element('input[name="radiumTreatments"]').to.not.be.selected;
    client.expect.element('input[name="campLejeune"]').to.not.be.selected;
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    client.expect.element('input[name="compensableVaServiceConnected-0"]').to.not.be.selected;
    client.expect.element('input[name="compensableVaServiceConnected-1"]').to.not.be.selected;
    client.expect.element('input[name="isVaServiceConnected-0"]').to.not.be.selected;
    client.expect.element('input[name="isVaServiceConnected-1"]').to.not.be.selected;
    client.expect.element('input[name="receivesVaPension-0"]').to.not.be.selected;
    client.expect.element('input[name="receivesVaPension-1"]').to.not.be.selected;
    HcaHelpers.completeVaBenefits(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="understandsFinancialDisclosure"] + label').to.be.visible;
    client.expect.element('input[name="understandsFinancialDisclosure"]').to.not.be.selected;
    HcaHelpers.completeFinancialDisclosure(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('select[name="maritalStatus"]').to.be.visible;
    client.expect.element('select[name="maritalStatus"]').to.have.value.that.equals('');
    client
      .setValue('select[name="maritalStatus"]', 'Married')
      .click('.form-panel');

    client.expect.element('input[name="fname"]').to.be.visible.before(Timeouts.normal);
    client.expect.element('input[name="fname"]').to.have.value.that.equals('');
    client.expect.element('input[name="mname"]').to.have.value.that.equals('');
    client.expect.element('input[name="lname"]').to.have.value.that.equals('');
    client.expect.element('select[name="suffix"]').to.have.value.that.equals('');
    client.expect.element('input[name="ssn"]').to.have.value.that.equals('');
    client.expect.element('select[name="spouseBirthMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="spouseBirthDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="spouseBirthYear"]').to.have.value.that.equals('');
    client.expect.element('select[name="marriageMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="marriageDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="marriageYear"]').to.have.value.that.equals('');
    client.expect.element('input[name="sameAddress-0"]').to.not.be.selected;
    client.expect.element('input[name="sameAddress-1"]').to.not.be.selected;

    client.click('input[name="sameAddress-1"]');
    client.expect.element('input[name="address"]').to.be.visible.before(Timeouts.normal);
    client.expect.element('input[name="address"]').to.have.value.that.equals('');
    client.expect.element('input[name="city"]').to.have.value.that.equals('');
    client.expect.element('select[name="country"]').to.have.value.that.equals('');
    client.expect.element('input[name="province"]').to.have.value.that.equals('');
    client.expect.element('input[name="postalCode"]').to.have.value.that.equals('');
    client.expect.element('select[name="state"]').not.to.be.present;
    client.expect.element('input[name="zip"]').not.to.be.present;

    client.click('input[name="cohabitedLastYear-1"]');
    client.expect.element('input[name="provideSupportLastYear-0"]').to.not.be.selected;
    client.expect.element('input[name="provideSupportLastYear-1"]').to.not.be.selected;
    HcaHelpers.completeSpouseInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/spouse-information');

    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    client.expect.element('input[name="hasChildrenToReport-0"]').to.not.be.selected;
    client.expect.element('input[name="hasChildrenToReport-1"]').to.not.be.selected;

    client.click('input[name="hasChildrenToReport-0"]');
    client.expect.element('input[name="fname"]').to.have.value.that.equals('');
    client.expect.element('input[name="mname"]').to.have.value.that.equals('');
    client.expect.element('input[name="lname"]').to.have.value.that.equals('');
    client.expect.element('select[name="suffix"]').to.have.value.that.equals('');
    client.expect.element('select[name="childRelation"]').to.have.value.that.equals('');
    client.expect.element('input[name="ssn"]').to.have.value.that.equals('');
    client.expect.element('select[name="childBirthMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="childBirthDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="childBirthYear"]').to.have.value.that.equals('');
    client.expect.element('select[name="childBecameDependentMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="childBecameDependentDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="childBecameDependentYear"]').to.have.value.that.equals('');
    client.expect.element('input[name="childDisabledBefore18-0"]').to.not.be.selected;
    client.expect.element('input[name="childDisabledBefore18-1"]').to.not.be.selected;
    client.expect.element('input[name="childAttendedSchoolLastYear-0"]').to.not.be.selected;
    client.expect.element('input[name="childAttendedSchoolLastYear-1"]').to.not.be.selected;
    client.expect.element('input[name="childEducationExpenses"]').to.have.value.that.equals('');
    client.expect.element('input[name="childCohabitedLastYear-0"]').to.not.be.selected;
    client.expect.element('input[name="childCohabitedLastYear-1"]').to.not.be.selected;

    client.click('input[name="childCohabitedLastYear-1"]');
    client.expect.element('input[name="childReceivedSupportLastYear-0"]').to.not.be.selected;
    client.expect.element('input[name="childReceivedSupportLastYear-1"]').to.not.be.selected;

    HcaHelpers.completeChildInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    client.expect.element('input[name="veteranGrossIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="veteranNetIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="veteranOtherIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="spouseGrossIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="spouseNetIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="spouseOtherIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="childGrossIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="childNetIncome"]').to.have.value.that.equals('');
    client.expect.element('input[name="ChildOtherIncome"]').to.have.value.that.equals('');
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.have.value.that.equals('');
    client.expect.element('input[name="deductibleFuneralExpenses"]').to.have.value.that.equals('');
    client.expect.element('input[name="deductibleEducationExpenses"]').to.have.value.that.equals('');
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    client.expect.element('input[name="isMedicaidEligible-0"]').to.not.be.selected;
    client.expect.element('input[name="isMedicaidEligible-1"]').to.not.be.selected;
    client.expect.element('input[name="isEnrolledMedicarePartA-0"]').to.not.be.selected;
    client.expect.element('input[name="isEnrolledMedicarePartA-1"]').to.not.be.selected;

    client.click('input[name="isEnrolledMedicarePartA-0"]');

    client.expect.element('select[name="medicarePartAEffectiveMonth"]').to.have.value.that.equals('');
    client.expect.element('select[name="medicarePartAEffectiveDay"]').to.have.value.that.equals('');
    client.expect.element('input[name="medicarePartAEffectiveYear"]').to.have.value.that.equals('');
    HcaHelpers.completeMedicareAndMedicaid(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    client.expect.element('input[name="isCoveredByHealthInsurance-0"]').to.not.be.selected;
    client.expect.element('input[name="isCoveredByHealthInsurance-1"]').to.not.be.selected;

    client.click('input[name="isCoveredByHealthInsurance-0"]');
    client.expect.element('input[name="insuranceName"]').to.have.value.that.equals('');
    client.expect.element('input[name="insurancePolicyHolderName"]').to.have.value.that.equals('');
    client.expect.element('input[name="insurancePolicyNumber"]').to.have.value.that.equals('');
    client.expect.element('input[name="insuranceGroupCode"]').to.have.value.that.equals('');
    HcaHelpers.completeInsuranceInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    client.expect.element('input[name="isEssentialAcaCoverage"]').to.not.be.selected;
    client.expect.element('select[name="state"]').to.have.value.that.equals('');
    client.expect.element('select[name="vaMedicalFacility"]').to.have.value.that.equals('');
    client.expect.element('input[name="wantsInitialVaContact-0"]').to.not.be.selected;
    client.expect.element('input[name="wantsInitialVaContact-1"]').to.not.be.selected;
    HcaHelpers.completeVaInsuranceInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;

    client.end();
  });
