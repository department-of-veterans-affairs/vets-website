import { format, subYears } from 'date-fns';
import maxTestData from './fixtures/data/maximal-test.json';
import { setupForAuth } from './utils';

const { data: testData } = maxTestData;

describe('HCA-Keyboard-Only', () => {
  // NOTE: This test is skipped in CI due to a limitiation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function () {
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
    cy.tabToContinueForm();

    // Race/Ethnicity/Origin
    selector = field => `[name="root_view:demographicCategories_${field}"]`;
    cy.tabToElementAndPressSpace(selector('isAsian'));
    cy.tabToContinueForm();

    // Mailing address
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
    cy.tabToContinueForm();

    // VA disability compensation
    cy.selectVaRadioOption('root_vaCompensationType', 'none');
    cy.tabToContinueForm();

    // VA pension
    cy.selectVaRadioOption('root_vaPensionType', 'No');
    cy.tabToContinueForm();

    // Military service
    cy.tabToContinueForm();

    // Service history
    selector = field => `[name="root_view:serviceHistory_${field}"]`;
    cy.tabToElementAndPressSpace(selector('purpleHeartRecipient'));
    cy.tabToContinueForm();

    // Toxic Exposure
    cy.selectYesNoVaRadioOption('root_hasTeraResponse', true);
    cy.tabToContinueForm();

    // Radiation cleanup
    cy.selectYesNoVaRadioOption('root_radiationCleanupEfforts', true);
    cy.tabToContinueForm();

    // Gulf War Service
    cy.selectYesNoVaRadioOption('root_gulfWarService', true);
    cy.tabToContinueForm();

    // Gulf War service dates
    const { gulfWarStartDate, gulfWarEndDate } =
      testData['view:gulfWarServiceDates'];
    selector = field => `root_view:gulfWarServiceDates_${field}`;
    cy.typeInDate(selector('gulfWarStartDate'), gulfWarStartDate);
    cy.typeInDate(selector('gulfWarEndDate'), gulfWarEndDate);
    cy.tabToContinueForm();

    // Combat Operation Service
    cy.selectYesNoVaRadioOption('root_combatOperationService', false);
    cy.tabToContinueForm();

    // Agent Orange Exposure
    cy.selectYesNoVaRadioOption('root_exposedToAgentOrange', false);
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
    const { toxicExposureStartDate, toxicExposureEndDate } =
      testData['view:toxicExposureDates'];
    selector = field => `root_view:toxicExposureDates_${field}`;
    cy.typeInDate(selector('toxicExposureStartDate'), toxicExposureStartDate);
    cy.typeInDate(selector('toxicExposureEndDate'), toxicExposureEndDate);
    cy.tabToContinueForm();

    // Financial info usage
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Disclose financial info
    cy.selectYesNoVaRadioOption('root_discloseFinancialInformation', true);
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
    cy.selectYesNoVaRadioOption('root_cohabitedLastYear', true);
    cy.selectYesNoVaRadioOption('root_sameAddress', false);
    cy.tabToContinueForm();

    // Spouse's contact info
    const { spouseAddress, spousePhone } =
      testData['view:spouseContactInformation'];
    cy.typeInAddress('root_spouseAddress', spouseAddress);
    cy.typeInIfDataExists('[name="root_spousePhone"]', spousePhone);
    cy.tabToContinueForm();

    // Your dependents (informational page)
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Dependents summary
    cy.selectYesNoVaRadioOption('root_view:reportDependents', true);
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
    selector = field => `[name="root_view:${field}_${field}"]`;
    cy.typeInIfDataExists(selector('grossIncome'), '20000');
    cy.typeInIfDataExists(selector('netIncome'), '10');
    cy.typeInIfDataExists(selector('otherIncome'), '10');
    cy.tabToContinueForm();

    // Dependent's expenses
    cy.selectRadioFromData('[name="root_attendedSchoolLastYear"]', 'Y');
    cy.typeInIfDataExists('[name="root_dependentEducationExpenses"]', '453');
    cy.tabToContinueForm();

    // Review dependents - say no to adding more
    cy.selectYesNoVaRadioOption('root_view:reportDependents', false);
    cy.tabToElementAndPressSpace('.usa-button-primary');

    // Veteran's income
    selector = field => `[name="root_view:veteran${field}_veteran${field}"]`;
    cy.typeInIfDataExists(selector('GrossIncome'), '3242434');
    cy.typeInIfDataExists(selector('NetIncome'), '23424');
    cy.typeInIfDataExists(selector('OtherIncome'), '23424');
    cy.tabToContinueForm();

    // Spouse's income
    selector = field => `[name="root_view:spouse${field}_spouse${field}"]`;
    cy.typeInIfDataExists(selector('GrossIncome'), '23424');
    cy.typeInIfDataExists(selector('NetIncome'), '23424');
    cy.typeInIfDataExists(selector('OtherIncome'), '23424');
    cy.tabToContinueForm();

    // Deductible expenses
    selector = field =>
      `[name="root_view:deductible${field}_deductible${field}"]`;
    cy.typeInIfDataExists(selector('MedicalExpenses'), '234');
    cy.typeInIfDataExists(selector('EducationExpenses'), '11');
    cy.typeInIfDataExists(selector('FuneralExpenses'), '10');
    cy.tabToContinueForm();

    // Medicaid eligibility
    cy.selectYesNoVaRadioOption('root_isMedicaidEligible', true);
    cy.tabToContinueForm();

    // Medicare enrollment
    cy.selectYesNoVaRadioOption('root_isEnrolledMedicarePartA', true);
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
    cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', true);
    cy.tabToContinueForm();

    // Policy information
    const policy = testData.providers[0];
    cy.typeInIfDataExists('[name="root_insuranceName"]', policy.insuranceName);
    cy.typeInIfDataExists(
      '[name="root_insurancePolicyHolderName"]',
      policy.insurancePolicyHolderName,
    );
    // Fill policy number or group code (at least one required)
    const policyOrGroupCode = policy['view:policyNumberOrGroupCode'];
    cy.typeInIfDataExists(
      '[name="root_view:policyNumberOrGroupCode_insurancePolicyNumber"]',
      policyOrGroupCode.insurancePolicyNumber,
    );

    cy.typeInIfDataExists(
      '[name="root_view:policyNumberOrGroupCode_insuranceGroupCode"]',
      policyOrGroupCode.insuranceGroupCode,
    );

    cy.tabToContinueForm();

    // Review insurance policies - say no to adding more
    cy.selectYesNoVaRadioOption('root_view:hasHealthInsuranceToAdd', false);
    cy.tabToContinueForm();

    // VA medical facility
    const { vaMedicalFacility, 'view:facilityState': facilityState } =
      testData['view:preferredFacility'];
    cy.get('[name="root_view:preferredFacility_view:facilityState"]').should(
      'exist',
    );
    cy.selectVaSelect(
      'root_view:preferredFacility_view:facilityState',
      facilityState,
    );
    cy.wait('@getFacilities');
    cy.selectVaSelect(
      'root_view:preferredFacility_vaMedicalFacility',
      vaMedicalFacility,
    );

    // Want VA to contact you (same page as facility)
    cy.selectYesNoVaRadioOption('root_wantsInitialVaContact', true);
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
