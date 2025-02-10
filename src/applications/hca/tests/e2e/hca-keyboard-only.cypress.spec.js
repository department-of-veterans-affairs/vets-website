import { format, subYears } from 'date-fns';
import maxTestData from './fixtures/data/maximal-test.json';
import { setupForAuth } from './utils';

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
    cy.tabToStartForm();
    cy.wait('@mockPrefill');
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Place of birth
    const { cityOfBirth, stateOfBirth } = testData['view:placeOfBirth'];
    let selector = field => `[name="root_view:placeOfBirth_${field}"]`;
    cy.typeInIfDataExists(selector('cityOfBirth'), cityOfBirth);
    cy.typeInIfDataExists(selector('stateOfBirth'), stateOfBirth);
    cy.tabToContinueForm();

    // Mothers maiden name
    cy.typeInIfDataExists(
      `[name="root_mothersMaidenName"]`,
      testData.mothersMaidenName,
    );
    cy.tabToContinueForm();

    // Birth sex
    cy.selectRadioFromData('[name="root_gender"]', testData.gender);
    cy.tabToContinueForm();

    // Race/Ethnicity/Origin
    selector = field => `[name="root_view:demographicCategories_${field}"]`;
    cy.tabToElementAndPressSpace(selector('isAsian'));
    cy.tabToContinueForm();

    // Mailing address
    const mailingAddress = testData.veteranAddress;
    cy.typeInAddress('veteranAddress', mailingAddress);
    cy.selectRadioFromData(
      '[name="root_view:doesMailingMatchHomeAddress"]',
      'N',
    );
    cy.tabToContinueForm();

    // Home address
    const homeAddress = testData.veteranHomeAddress;
    cy.typeInAddress('root_veteranHomeAddress', homeAddress);
    cy.tabToContinueForm();

    // Contact information
    cy.typeInIfDataExists('[name="root_email"]', testData.email);
    cy.typeInIfDataExists('[name="root_homePhone"]', testData.homePhone);
    cy.typeInIfDataExists('[name="root_mobilePhone"]', testData.mobilePhone);
    cy.tabToContinueForm();

    // VA disability compensation
    cy.selectRadioFromData('name="root_vaCompensationType"]', 'none');
    cy.tabToContinueForm();

    // VA pension
    cy.selectRadioFromData('[name="root_vaPensionType"]', 'No');
    cy.tabToContinueForm();

    // Military service
    cy.selectDropdownFromData(
      '[name="root_lastServiceBranch"]',
      testData.lastServiceBranch,
    );
    cy.typeInDate('root_lastEntryDate', testData.lastEntryDate);
    cy.typeInDate('root_lastDischargeDate', testData.lastDischargeDate);
    cy.selectDropdownFromData(
      '[name="root_dischargeType"]',
      testData.dischargeType,
    );
    cy.tabToContinueForm();

    // Service history
    selector = field => `[name="root_view:serviceHistory_${field}"]`;
    cy.tabToElementAndPressSpace(selector('purpleHeartRecipient'));
    cy.tabToContinueForm();

    // Toxic exposure
    cy.selectRadioFromData('[name="root_hasTeraResponse"]', 'Y');
    cy.tabToContinueForm();

    // Radian clean-up
    cy.selectRadioFromData('name="root_radiationCleanupEfforts"]', 'Y');
    cy.tabToContinueForm();

    // Gulf War service
    cy.selectRadioFromData('[name="root_gulfWarService"]', 'Y');
    cy.tabToContinueForm();

    // Gulf War service dates
    const { gulfWarStartDate, gulfWarEndDate } = testData[
      'view:gulfWarServiceDates'
    ];
    cy.typeInDate(
      'root_view:gulfWarServiceDates_gulfWarStartDate',
      gulfWarStartDate,
    );
    cy.typeInDate(
      'root_view:gulfWarServiceDates_gulfWarEndDate',
      gulfWarEndDate,
    );
    cy.tabToContinueForm();

    // Combat Operation service
    cy.selectRadioFromData('name="root_combatOperationService"]', 'N');
    cy.tabToContinueForm();

    // Agent Orange exposure
    cy.selectRadioFromData('[name="root_exposedToAgentOrange"]', 'N');
    cy.tabToContinueForm();

    // Other toxic exposures
    selector = field => `[name="root_view:otherToxicExposures_${field}"]`;
    cy.tabToElementAndPressSpace(selector('exposureToOther'));
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
    cy.typeInDate(
      'root_view:toxicExposureDates_toxicExposureStartDate',
      toxicExposureStartDate,
    );
    cy.typeInDate(
      'root_view:toxicExposureDates_toxicExposureEndDate',
      toxicExposureEndDate,
    );
    cy.tabToContinueForm();

    // Financial info usage
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Disclose financial info
    cy.selectRadioFromData('discloseFinancialInformation', 'Y');
    cy.tabToContinueForm();

    // Financial info needed
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Marital status
    cy.selectDropdownFromData(
      '[name="root_maritalStatus"]',
      testData.maritalStatus,
    );
    cy.tabToContinueForm();

    // Spouse's basic info
    cy.typeInFullName('root_spouseFullName', testData.spouseFullName);
    cy.typeInIfDataExists(
      '[name="root_spouseSocialSecurityNumber"]',
      testData.spouseSocialSecurityNumber,
    );
    cy.typeInDate('root_spouseDateOfBirth', testData.spouseDateOfBirth);
    cy.typeInDate('root_dateOfMarriage', testData.dateOfMarriage);
    cy.tabToContinueForm();

    // Spouse's addt'l info
    cy.selectRadioFromData('[name="root_cohabitedLastYear"]', 'Y');
    cy.selectRadioFromData('[name="root_sameAddress"]', 'N');
    cy.tabToContinueForm();

    // Spouse's contact info
    const { spouseAddress, spousePhone } = testData[
      'view:spouseContactInformation'
    ];
    cy.typeInAddress('root_spouseAddress', spouseAddress);
    cy.typeInIfDataExists('[name="root_spousePhone"]', spousePhone);
    cy.tabToContinueForm();

    // Dependents
    cy.selectRadioFromData('[name="root_view:reportDependents"]', 'Y');
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Dependent's basic info
    const dependent = testData.dependents[0];
    cy.typeInFullName('root_fullName', dependent.fullName);
    cy.selectDropdownFromData(
      '[name="root_dependentRelation"]',
      dependent.dependentRelation,
    );
    cy.typeInIfDataExists(
      '[name="root_socialSecurityNumber"]',
      dependent.socialSecurityNumber,
    );

    const birthYear = format(subYears(new Date(), 20), 'yyyy');
    cy.typeInDate('root_dateOfBirth', `${birthYear}-01-01`);
    cy.typeInDate('root_becameDependent', `${birthYear}-01-01`);
    cy.tabToContinueForm();

    // Dependent's addt'l info
    cy.selectRadioFromData('[name="root_disabledBefore18"]', 'N');
    cy.selectRadioFromData('[name="root_cohabitedLastYear"]', 'N');
    cy.selectRadioFromData('[name="root_view:dependentIncome"]', 'Y');
    cy.tabToContinueForm();

    // Financial support for dependent
    cy.selectRadioFromData('[name="root_receivedSupportLastYear"]', 'N');
    cy.tabToContinueForm();

    // Dependent's income
    selector = field => `[name="root_view:${field}_${field}`;
    cy.typeInIfDataExists(selector('grossIncome'), dependent.grossIncome);
    cy.typeInIfDataExists(selector('netIncome'), dependent.netIncome);
    cy.typeInIfDataExists(selector('otherIncome'), dependent.otherIncome);
    cy.tabToContinueForm();

    // Dependent's expenses
    cy.selectRadioFromData('[name="root_attendedSchoolLastYear"]', 'Y');
    cy.typeInIfDataExists(
      '[name="root_dependentEducationExpenses"]',
      dependent.dependentEducationExpenses,
    );
    cy.tabToContinueForm();

    // Review dependents
    cy.selectRadioFromData('[name="root_view:reportDependents"]', 'N');
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Veteran's income
    cy.typeInIfDataExists(selector('veteranGrossIncome'), '3242434');
    cy.typeInIfDataExists(selector('veteranNetIncome'), '23424');
    cy.typeInIfDataExists(selector('veteranOtherIncome'), '23424');
    cy.tabToContinueForm();

    // Spouse's income
    cy.typeInIfDataExists(selector('spouseGrossIncome'), '23424');
    cy.typeInIfDataExists(selector('spouseNetIncome'), '23424');
    cy.typeInIfDataExists(selector('spouseOtherIncome'), '23424');
    cy.tabToContinueForm();

    // Deductible expenses
    cy.typeInIfDataExists(selector('deductibleMedicalExpenses'), '234');
    cy.typeInIfDataExists(selector('deductableEducationExpenses'), '11');
    cy.typeInIfDataExists(selector('deductibleFuneralExpenses'), '10');
    cy.tabToContinueForm();

    // Medicaid eligibility
    cy.selectRadioFromData('[name="root_isMedicaidEligible"]', 'Y');
    cy.tabToContinueForm();

    // Medicare enrollment
    cy.selectRadioFromData('[name="root_isEnrolledMedicarePartA"]', 'Y');
    cy.tabToContinueForm();

    // Medicare Part A effective date
    cy.typeInDate(
      'root_medicarePartAEffectiveDate',
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
    cy.selectRadioFromData('isCoveredByHealthInsurance', 'Y');

    const policy = testData.providers[0];
    selector = field => `[name="root_providers_0_${field}"]`;
    cy.typeInIfDataExists(selector('insuranceName'), policy.insuranceName);
    cy.typeInIfDataExists(
      selector('insurancePolicyHolderName'),
      policy.insurancePolicyHolderName,
    );
    cy.typeInIfDataExists(
      selector('insurancePolicyNumber'),
      policy.insurancePolicyNumber,
    );
    cy.tabToContinueForm();

    // VA medical facility
    const { vaMedicalFacility, 'view:facilityState': facilityState } = testData[
      'view:preferredFacility'
    ];
    selector = field => `[name="root_view:preferredFacility_${field}"]`;
    cy.selectDropdownFromData(
      selector('[name="root_view:facilityState"]'),
      facilityState,
    );
    cy.wait('@getFacilities');
    cy.selectDropdownFromData(
      selector('[name="root_vaMedicalFacility"]'),
      vaMedicalFacility,
    );

    cy.selectRadioFromData('[name="root_wantsInitialVaContact"]', 'Y');
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
