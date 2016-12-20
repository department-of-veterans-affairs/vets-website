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
    E2eHelpers.overrideSmoothScrolling(client);
    E2eHelpers.expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    client.expect.element('input[name="fname"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'input[name="fname"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="mname"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="lname"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="suffix"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="mothersMaidenName"]');
    HcaHelpers.completePersonalInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'select[name="veteranBirthMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="veteranBirthDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="veteranBirthYear"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="ssn"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="cityOfBirth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="stateOfBirth"]');
    HcaHelpers.completeBirthInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'select[name="gender"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="maritalStatus"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isAmericanIndianOrAlaskanNative"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isBlackOrAfricanAmerican"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isNativeHawaiianOrOtherPacificIslander"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isAsian"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isWhite"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isSpanishHispanicLatino"]');
    HcaHelpers.completeDemographicInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'input[name="address"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="city"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="country"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="province"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="postalCode"]');
    client.expect.element('select[name="state"]').not.to.be.present;
    client.expect.element('input[name="zip"]').not.to.be.present;
    HcaHelpers.completeVeteranAddress(client, HcaHelpers.testValues, true);
    client.expect.element('select[name="state"]').to.be.visible;
    client.expect.element('input[name="zip"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'input.first-email');
    E2eHelpers.expectValueToBeBlank(client, 'input.second-email');
    E2eHelpers.expectValueToBeBlank(client, 'input.home-phone');
    E2eHelpers.expectValueToBeBlank(client, 'input.mobile-phone');
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'select[name="lastServiceBranch"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="lastEntryMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="lastEntryDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="lastEntryYear"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="lastDischargeMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="lastDischargeDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="lastDischargeYear"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="dischargeType"]');
    HcaHelpers.completeMilitaryService(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="purpleHeartRecipient"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isFormerPow"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="postNov111998Combat"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="disabledInLineOfDuty"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="swAsiaCombat"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="vietnamService"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="exposedToRadiation"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="radiumTreatments"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="campLejeune"]');
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="compensableVaServiceConnected-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="compensableVaServiceConnected-1"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isVaServiceConnected-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isVaServiceConnected-1"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="receivesVaPension-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="receivesVaPension-1"]');
    HcaHelpers.completeVaBenefits(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="discloseFinancialInformation-0"] + label').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="discloseFinancialInformation-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="discloseFinancialInformation-1"]');
    HcaHelpers.completeFinancialDisclosure(client, HcaHelpers.testValues);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('input[name="fname"]').to.be.visible.before(Timeouts.normal);
    E2eHelpers.expectValueToBeBlank(client, 'input[name="fname"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="mname"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="lname"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="suffix"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="ssn"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="spouseBirthMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="spouseBirthDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="spouseBirthYear"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="marriageMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="marriageDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="marriageYear"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="sameAddress-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="sameAddress-1"]');

    client.click('input[name="sameAddress-1"]');
    client.expect.element('input[name="address"]').to.be.visible.before(Timeouts.normal);
    E2eHelpers.expectValueToBeBlank(client, 'input[name="address"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="city"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="country"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="province"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="postalCode"]');
    client.expect.element('select[name="state"]').not.to.be.present;
    client.expect.element('input[name="zip"]').not.to.be.present;

    client.click('input[name="cohabitedLastYear-1"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="provideSupportLastYear-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="provideSupportLastYear-1"]');
    HcaHelpers.completeSpouseInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/spouse-information');

    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="hasChildrenToReport-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="hasChildrenToReport-1"]');

    client.click('input[name="hasChildrenToReport-0"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="fname"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="mname"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="lname"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="suffix"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="childRelation"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="ssn"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="childBirthMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="childBirthDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="childBirthYear"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="childBecameDependentMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="childBecameDependentDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="childBecameDependentYear"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childDisabledBefore18-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childDisabledBefore18-1"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childAttendedSchoolLastYear-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childAttendedSchoolLastYear-1"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="childEducationExpenses"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childCohabitedLastYear-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childCohabitedLastYear-1"]');

    client.click('input[name="childCohabitedLastYear-1"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childReceivedSupportLastYear-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="childReceivedSupportLastYear-1"]');

    HcaHelpers.completeChildInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'input[name="veteranGrossIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="veteranNetIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="veteranOtherIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="spouseGrossIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="spouseNetIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="spouseOtherIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="childGrossIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="childNetIncome"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="childOtherIncome"]');
    HcaHelpers.completeAnnualIncomeInformation(client, HcaHelpers.testValues);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    E2eHelpers.expectValueToBeBlank(client, 'input[name="deductibleMedicalExpenses"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="deductibleFuneralExpenses"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="deductibleEducationExpenses"]');
    HcaHelpers.completeDeductibleExpenses(client, HcaHelpers.testValues);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isMedicaidEligible-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isMedicaidEligible-1"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isEnrolledMedicarePartA-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isEnrolledMedicarePartA-1"]');

    client.click('input[name="isEnrolledMedicarePartA-0"]');

    E2eHelpers.expectValueToBeBlank(client, 'select[name="medicarePartAEffectiveMonth"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="medicarePartAEffectiveDay"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="medicarePartAEffectiveYear"]');
    HcaHelpers.completeMedicareAndMedicaid(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isCoveredByHealthInsurance-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isCoveredByHealthInsurance-1"]');

    client.click('input[name="isCoveredByHealthInsurance-0"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="insuranceName"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="insurancePolicyHolderName"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="insurancePolicyNumber"]');
    E2eHelpers.expectValueToBeBlank(client, 'input[name="insuranceGroupCode"]');
    HcaHelpers.completeInsuranceInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="isEssentialAcaCoverage"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="state"]');
    E2eHelpers.expectValueToBeBlank(client, 'select[name="vaMedicalFacility"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="wantsInitialVaContact-0"]');
    E2eHelpers.expectInputToNotBeSelected(client, 'input[name="wantsInitialVaContact-1"]');
    HcaHelpers.completeVaInsuranceInformation(client, HcaHelpers.testValues, true);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;
    client.click('[name=privacyAgreement]');
    client.click('.form-panel .usa-button-primary');
    // E2eHelpers.expectNavigateAwayFrom(client, '/review-and-submit');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;

    client.end();
  });
