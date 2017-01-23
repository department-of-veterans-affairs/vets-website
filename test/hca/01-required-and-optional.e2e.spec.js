const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');
const HcaHelpers = require('../util/hca-helpers.js');
const selectDropdown = E2eHelpers.selectDropdown;

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
    HcaHelpers.completePersonalInformation(client, HcaHelpers.testValues, false);
    client.click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    selectDropdown(client, 'veteranBirthMonth', '4');
    selectDropdown(client, 'veteranBirthDay', '23');
    selectDropdown(client, 'stateOfBirth', 'OH');
    client
      .setValue('input[name="veteranBirthYear"]', '1980')
      .setValue('input[name="ssn"]', '111-22-3333')
      .setValue('input[name="cityOfBirth"]', 'Akron')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    selectDropdown(client, 'gender', 'M');
    selectDropdown(client, 'maritalStatus', 'Married');
    client
      .click('input[name="isAmericanIndianOrAlaskanNative"]')
      .click('input[name="isBlackOrAfricanAmerican"]')
      .click('input[name="isNativeHawaiianOrOtherPacificIslander"]')
      .click('input[name="isAsian"]')
      .click('input[name="isWhite"]')
      .click('input[name="isSpanishHispanicLatino"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    client
      .setValue('input[name="address"]', '111 S Michigan Ave')
      .setValue('input[name="city"]', 'Chicago');

    selectDropdown(client, 'country', 'USA');
    selectDropdown(client, 'state', 'IL');

    client
      .setValue('input[name="zip"]', '60603')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    client
      .setValue('input.first-email', 'bills@bard.com')
      .setValue('input.second-email', 'bills@bard.com')
      .setValue('input.home-phone', '3125551212')
      .setValue('input.mobile-phone', '3125551213')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    selectDropdown(client, 'lastServiceBranch', 'army');
    selectDropdown(client, 'lastEntryMonth', '10');
    selectDropdown(client, 'lastEntryDay', '10');
    selectDropdown(client, 'lastDischargeMonth', '11');
    selectDropdown(client, 'lastDischargeDay', '11');
    selectDropdown(client, 'dischargeType', 'honorable');

    client
      .setValue('input[name="lastEntryYear"]', '2000')
      .setValue('input[name="lastDischargeYear"]', '2004')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    client
      .click('input[name="purpleHeartRecipient"]')
      .click('input[name="isFormerPow"]')
      .click('input[name="postNov111998Combat"]')
      .click('input[name="disabledInLineOfDuty"]')
      .click('input[name="swAsiaCombat"]')
      .click('input[name="vietnamService"]')
      .click('input[name="exposedToRadiation"]')
      .click('input[name="radiumTreatments"]')
      .click('input[name="campLejeune"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    client
      .click('input[name="compensableVaServiceConnected-0"]')
      .click('input[name="isVaServiceConnected-0"]')
      .click('input[name="receivesVaPension-0"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="discloseFinancialInformation-0"] + label').to.be.visible;
    client
      .click('input[name="discloseFinancialInformation-0"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('input[name="fname"]').to.be.visible.before(Timeouts.normal);

    selectDropdown(client, 'suffix', 'Sr.');
    selectDropdown(client, 'spouseBirthMonth', '8');
    selectDropdown(client, 'spouseBirthDay', '6');
    selectDropdown(client, 'marriageMonth', '6');
    selectDropdown(client, 'marriageDay', '1');

    client
      .setValue('input[name="fname"]', 'Anne')
      .setValue('input[name="mname"]', 'Jacqueline')
      .setValue('input[name="lname"]', 'Hathaway')
      .setValue('input[name="ssn"]', '444-55-6666')
      .setValue('input[name="spouseBirthYear"]', '1980')
      .setValue('input[name="marriageYear"]', '2010')
      .click('input[name="sameAddress-1"]');
    client.expect.element('input[name="address"]').to.be.visible.before(Timeouts.normal);

    client
      .setValue('input[name="address"]', '115 S Michigan Ave')
      .setValue('input[name="city"]', 'Chicago');

    E2eHelpers.selectDropdown(client, 'country', 'USA');
    E2eHelpers.selectDropdown(client, 'state', 'IL');

    client
      .setValue('input[name="zip"]', '60603')
      .click('input[name="cohabitedLastYear-1"]')
      .click('input[name="provideSupportLastYear-0"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/spouse-information');


    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    client.click('input[name="hasChildrenToReport-0"]');
    client.expect.element('input[name="fname"]').to.be.visible.before(Timeouts.normal);
    selectDropdown(client, 'suffix', 'Jr.');
    selectDropdown(client, 'childRelation', 'Son');
    selectDropdown(client, 'childBirthMonth', '2');
    selectDropdown(client, 'childBirthDay', '2');
    selectDropdown(client, 'childBecameDependentMonth', '2');
    selectDropdown(client, 'childBecameDependentDay', '2');

    client
      .setValue('input[name="fname"]', 'Hamnet')
      .setValue('input[name="mname"]', 'Dirtbike')
      .setValue('input[name="lname"]', 'Shakespeare')
      .setValue('input[name="ssn"]', '777-88-9999')
      .setValue('input[name="childBirthYear"]', '2012')
      .setValue('input[name="childBecameDependentYear"]', '2012')
      .click('input[name="childDisabledBefore18-0"]')
      .click('input[name="childAttendedSchoolLastYear-0"]')
      .setValue('input[name="childEducationExpenses"]', '6000')
      .click('input[name="childCohabitedLastYear-1"]')
      .click('input[name="childReceivedSupportLastYear-0"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    client
      .setValue('input[name="veteranGrossIncome"]', '10000')
      .setValue('input[name="veteranNetIncome"]', '9000')
      .setValue('input[name="veteranOtherIncome"]', '8000')
      .setValue('input[name="spouseGrossIncome"]', '7000')
      .setValue('input[name="spouseNetIncome"]', '6000')
      .setValue('input[name="spouseOtherIncome"]', '5000')
      .setValue('input[name="childGrossIncome"]', '4000')
      .setValue('input[name="childNetIncome"]', '3000')
      .setValue('input[name="childOtherIncome"]', '2000')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    client
      .setValue('input[name="deductibleMedicalExpenses"]', '1000')
      .setValue('input[name="deductibleFuneralExpenses"]', '2000')
      .setValue('input[name="deductibleEducationExpenses"]', '3000')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    client
      .click('input[name="isMedicaidEligible-1"]')
      .click('input[name="isEnrolledMedicarePartA-0"]');

    selectDropdown(client, 'medicarePartAEffectiveMonth', '4');
    selectDropdown(client, 'medicarePartAEffectiveDay', '23');

    client
      .setValue('input[name="medicarePartAEffectiveYear"]', '1980')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    client.click('input[name="isCoveredByHealthInsurance-0"]');
    client.expect.element('input[name="insuranceName"]').to.be.visible.before(Timeouts.normal);
    client
      .setValue('input[name="insuranceName"]', 'BCBS')
      .setValue('input[name="insurancePolicyHolderName"]', 'William Shakespeare')
      .setValue('input[name="insurancePolicyNumber"]', '100')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    selectDropdown(client, 'state', 'IL');
    selectDropdown(client, 'vaMedicalFacility', '556GA');
    client
      .click('input[name="isEssentialAcaCoverage"]')
      .click('input[name="wantsInitialVaContact-0"]')
      .click('.form-panel .usa-button-primary');
    E2eHelpers.expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;
    client.click('[name=privacyAgreement]');
    client.click('.form-panel .usa-button-primary');
    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(Timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;


    client.end();
  });
