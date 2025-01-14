import { format, subYears } from 'date-fns';
import maxTestData from './fixtures/data/maximal-test.json';
import {
  fillAddressWithKeyboard,
  fillDateWithKeyboard,
  fillNameWithKeyboard,
  selectDropdownWithKeyboard,
  selectRadioWithKeyboard,
  setupForAuth,
} from './utils';

const { data: testData } = maxTestData;

describe('HCA-Keyboard-Only', () => {
  // NOTE: This test is skipped in CI due to a limitiation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();
    setupForAuth();
  });

  it('should navigate and input maximal data using only a keyboard', () => {
    cy.tabToElement('[href="#start"]');
    cy.realPress('Enter');

    cy.wait('@mockPrefill');
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Place of birth
    const { cityOfBirth, stateOfBirth } = testData['view:placeOfBirth'];
    let prefix = '[name="root_view:placeOfBirth_';
    cy.typeInIfDataExists(`${prefix}cityOfBirth"]`, cityOfBirth);
    cy.typeInIfDataExists(`${prefix}stateOfBirth"]`, stateOfBirth);
    cy.tabToContinueForm();

    // Mothers maiden name
    cy.typeInIfDataExists(
      `[name="root_mothersMaidenName"]`,
      testData.mothersMaidenName,
    );
    cy.tabToContinueForm();

    // Birth sex
    selectRadioWithKeyboard('gender', testData.gender);
    cy.tabToContinueForm();

    // Race/Ethnicity/Origin
    prefix = '[name="root_view:demographicCategories_';
    cy.tabToElementAndPressSpace(`${prefix}isAmericanIndianOrAlaskanNative"]`);
    cy.tabToElementAndPressSpace(`${prefix}isAsian"]`);
    cy.tabToElementAndPressSpace(`${prefix}isBlackOrAfricanAmerican"]`);
    cy.tabToElementAndPressSpace(`${prefix}isSpanishHispanicLatino"]`);
    cy.tabToElementAndPressSpace(
      `${prefix}isNativeHawaiianOrOtherPacificIslander"]`,
    );
    cy.tabToElementAndPressSpace(`${prefix}isWhite"]`);
    cy.tabToContinueForm();

    // Mailing address
    const mailingAddress = testData.veteranAddress;
    fillAddressWithKeyboard('veteranAddress', mailingAddress);
    selectRadioWithKeyboard('view:doesMailingMatchHomeAddress', 'N');
    cy.tabToContinueForm();

    // Home address
    const homeAddress = testData.veteranHomeAddress;
    fillAddressWithKeyboard('veteranHomeAddress', homeAddress);
    cy.tabToContinueForm();

    // Contact information
    cy.typeInIfDataExists('[name="root_email"]', testData.email);
    cy.typeInIfDataExists('[name="root_homePhone"]', testData.homePhone);
    cy.typeInIfDataExists('[name="root_mobilePhone"]', testData.mobilePhone);
    cy.tabToContinueForm();

    // VA disability compensation
    selectRadioWithKeyboard('vaCompensationType', 'none');
    cy.tabToContinueForm();

    // VA pension
    selectRadioWithKeyboard('vaPensionType', 'No');
    cy.tabToContinueForm();

    // Military service
    selectDropdownWithKeyboard('lastServiceBranch', testData.lastServiceBranch);
    fillDateWithKeyboard('lastEntryDate', testData.lastEntryDate);
    fillDateWithKeyboard('lastDischargeDate', testData.lastDischargeDate);
    selectDropdownWithKeyboard('dischargeType', testData.dischargeType);
    cy.tabToContinueForm();

    // Service history
    prefix = '[name="root_view:serviceHistory_';
    cy.tabToElementAndPressSpace(`${prefix}purpleHeartRecipient"]`);
    cy.tabToElementAndPressSpace(`${prefix}isFormerPow"]`);
    cy.tabToElementAndPressSpace(`${prefix}postNov111998Combat"]`);
    cy.tabToElementAndPressSpace(`${prefix}disabledInLineOfDuty"]`);
    cy.tabToElementAndPressSpace(`${prefix}swAsiaCombat"]`);
    cy.tabToContinueForm();

    // Toxic exposure
    selectRadioWithKeyboard('hasTeraResponse', 'Y');
    cy.tabToContinueForm();

    // Radian clean-up
    selectRadioWithKeyboard('radiationCleanupEfforts', 'Y');
    cy.tabToContinueForm();

    // Gulf War service
    selectRadioWithKeyboard('gulfWarService', 'Y');
    cy.tabToContinueForm();

    // Gulf War service dates
    const { gulfWarStartDate, gulfWarEndDate } = testData[
      'view:gulfWarServiceDates'
    ];
    fillDateWithKeyboard(
      'view:gulfWarServiceDates_gulfWarStartDate',
      gulfWarStartDate,
    );
    fillDateWithKeyboard(
      'view:gulfWarServiceDates_gulfWarEndDate',
      gulfWarEndDate,
    );
    cy.tabToContinueForm();

    // Combat Operation service
    selectRadioWithKeyboard('combatOperationService', 'N');
    cy.tabToContinueForm();

    // Agent Orange exposure
    selectRadioWithKeyboard('exposedToAgentOrange', 'N');
    cy.tabToContinueForm();

    // Other toxic exposures
    prefix = '[name="root_view:otherToxicExposures_';
    cy.tabToElementAndPressSpace(`${prefix}exposureToAirPollutants"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToAsbestos"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToChemicals"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToContaminatedWater"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToMustardGas"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToOccupationalHazards"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToRadiation"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToShad"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToWarfareAgents"]`);
    cy.tabToElementAndPressSpace(`${prefix}exposureToOther"]`);
    cy.tabToContinueForm();

    // Other toxic exposure details
    cy.typeInIfDataExists(
      '[name="root_otherToxicExposure"]',
      testData.otherToxicExposure,
    );
    cy.tabToContinueForm();

    // Other toxic exposure dates
    const { toxicExposureStartDate, toxicExposureEndDate } = testData[
      'view:toxicExposureDates'
    ];
    fillDateWithKeyboard(
      'view:toxicExposureDates_toxicExposureStartDate',
      toxicExposureStartDate,
    );
    fillDateWithKeyboard(
      'view:toxicExposureDates_toxicExposureEndDate',
      toxicExposureEndDate,
    );
    cy.tabToContinueForm();

    // Financial info usage
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Disclose financial info
    selectRadioWithKeyboard('discloseFinancialInformation', 'Y');
    cy.tabToContinueForm();

    // Financial info needed
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Marital status
    selectDropdownWithKeyboard('maritalStatus', testData.maritalStatus);
    cy.tabToContinueForm();

    // Spouse's basic info
    fillNameWithKeyboard('spouseFullName', testData.spouseFullName);
    cy.typeInIfDataExists(
      '[name="root_spouseSocialSecurityNumber"]',
      testData.spouseSocialSecurityNumber,
    );
    fillDateWithKeyboard('spouseDateOfBirth', testData.spouseDateOfBirth);
    fillDateWithKeyboard('dateOfMarriage', testData.dateOfMarriage);
    cy.tabToContinueForm();

    // Spouse's addt'l info
    selectRadioWithKeyboard('cohabitedLastYear', 'Y');
    selectRadioWithKeyboard('sameAddress', 'N');
    cy.tabToContinueForm();

    // Spouse's contact info
    const { spouseAddress, spousePhone } = testData[
      'view:spouseContactInformation'
    ];
    fillAddressWithKeyboard('spouseAddress', spouseAddress);
    cy.typeInIfDataExists('[name="root_spousePhone"]', spousePhone);
    cy.tabToContinueForm();

    // Dependents
    selectRadioWithKeyboard('view:reportDependents', 'Y');
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Dependent's basic info
    const dependent = testData.dependents[0];
    fillNameWithKeyboard('fullName', dependent.fullName);
    selectDropdownWithKeyboard(
      'dependentRelation',
      dependent.dependentRelation,
    );
    cy.typeInIfDataExists(
      '[name="root_socialSecurityNumber"]',
      dependent.socialSecurityNumber,
    );

    const birthYear = format(subYears(new Date(), 20), 'yyyy');
    fillDateWithKeyboard('dateOfBirth', `${birthYear}-01-01`);
    fillDateWithKeyboard('becameDependent', `${birthYear}-01-01`);
    cy.tabToContinueForm();

    // Dependent's addt'l info
    selectRadioWithKeyboard('disabledBefore18', 'N');
    selectRadioWithKeyboard('cohabitedLastYear', 'N');
    selectRadioWithKeyboard('view:dependentIncome', 'Y');
    cy.tabToContinueForm();

    // Financial support for dependent
    selectRadioWithKeyboard('receivedSupportLastYear', 'N');
    cy.tabToContinueForm();

    // Dependent's income
    prefix = '[name="root_view:grossIncome_';
    cy.typeInIfDataExists(`${prefix}grossIncome"]`, '20000');

    prefix = '[name="root_view:netIncome_';
    cy.typeInIfDataExists(`${prefix}netIncome"]`, '10');

    prefix = '[name="root_view:otherIncome_';
    cy.typeInIfDataExists(`${prefix}otherIncome"]`, '10');
    cy.tabToContinueForm();

    // Dependent's expenses
    selectRadioWithKeyboard('attendedSchoolLastYear', 'Y');
    cy.typeInIfDataExists('[name="root_dependentEducationExpenses"]', '453');
    cy.tabToContinueForm();

    // Review dependents
    selectRadioWithKeyboard('view:reportDependents', 'N');
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Veteran's income
    prefix = '[name="root_view:veteranGrossIncome_veteran';
    cy.typeInIfDataExists(`${prefix}GrossIncome"]`, '3242434');

    prefix = '[name="root_view:veteranNetIncome_veteran';
    cy.typeInIfDataExists(`${prefix}NetIncome"]`, '23424');

    prefix = '[name="root_view:veteranOtherIncome_veteran';
    cy.typeInIfDataExists(`${prefix}OtherIncome"]`, '23424');
    cy.tabToContinueForm();

    // Spouse's income
    prefix = '[name="root_view:spouseGrossIncome_spouse';
    cy.typeInIfDataExists(`${prefix}GrossIncome"]`, '23424');

    prefix = '[name="root_view:spouseNetIncome_spouse';
    cy.typeInIfDataExists(`${prefix}NetIncome"]`, '23424');

    prefix = '[name="root_view:spouseOtherIncome_spouse';
    cy.typeInIfDataExists(`${prefix}OtherIncome"]`, '23424');
    cy.tabToContinueForm();

    // Deductible expenses
    prefix = '[name="root_view:deductibleMedicalExpenses_deductible';
    cy.typeInIfDataExists(`${prefix}MedicalExpenses"]`, '234');

    prefix = '[name="root_view:deductibleEducationExpenses_deductible';
    cy.typeInIfDataExists(`${prefix}EducationExpenses"]`, '11');

    prefix = '[name="root_view:deductibleFuneralExpenses_deductible';
    cy.typeInIfDataExists(`${prefix}FuneralExpenses"]`, '10');
    cy.tabToContinueForm();

    // Medicaid eligibility
    selectRadioWithKeyboard('isMedicaidEligible', 'Y');
    cy.tabToContinueForm();

    // Medicare enrollment
    selectRadioWithKeyboard('isEnrolledMedicarePartA', 'Y');
    cy.tabToContinueForm();

    // Medicare Part A effective date
    fillDateWithKeyboard(
      'medicarePartAEffectiveDate',
      testData.medicarePartAEffectiveDate,
    );
    cy.typeInIfDataExists(
      '[name="root_medicareClaimNumber"]',
      testData.medicareClaimNumber,
    );
    cy.tabToContinueForm();

    // Health insurance info
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Health insurance coverage
    selectRadioWithKeyboard('isCoveredByHealthInsurance', 'Y');

    const policy = testData.providers[0];
    prefix = '[name="root_providers_0_';
    cy.typeInIfDataExists(`${prefix}insuranceName"]`, policy.insuranceName);
    cy.typeInIfDataExists(
      `${prefix}insurancePolicyHolderName"]`,
      policy.insurancePolicyHolderName,
    );
    cy.typeInIfDataExists(
      `${prefix}insurancePolicyNumber"]`,
      policy.insurancePolicyNumber,
    );
    cy.tabToContinueForm();

    // VA medical facility
    const { vaMedicalFacility, 'view:facilityState': facilityState } = testData[
      'view:preferredFacility'
    ];
    prefix = 'view:preferredFacility';
    selectDropdownWithKeyboard(`${prefix}_view:facilityState`, facilityState);
    selectDropdownWithKeyboard(
      `${prefix}_vaMedicalFacility`,
      vaMedicalFacility,
    );

    selectRadioWithKeyboard('wantsInitialVaContact', 'Y');
    cy.tabToContinueForm();

    // Review / Submit
    cy.tabToElementAndPressSpace('.va-accordion__button');
    cy.tabToElementAndPressSpace(
      'va-checkbox[name="privacyAgreementAccepted"]',
    );
    cy.tabToSubmitForm();

    // Confirmation
    cy.location('pathname').should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
  });
});
