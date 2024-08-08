import { format, subYears } from 'date-fns';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockUser from './fixtures/mocks/mockUser';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import mockPrefill from './fixtures/mocks/mockPrefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import {
  fillAddressWithKeyboard,
  fillDateWithKeyboard,
  fillNameWithKeyboard,
  selectRadioWithKeyboard,
  selectDropdownWithKeyboard,
} from './utils';

describe('HCA-Keyboard-Only', () => {
  // NOTE: This test is skipped in CI due to a limitiation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: mockEnrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/health_care_applications/rating_info', {
      statusCode: 200,
      body: {
        data: {
          id: '',
          type: 'hash',
          attributes: { userPercentOfDisability: 0 },
        },
      },
    }).as('mockDisabilityRating');
    cy.intercept('GET', '/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
    cy.intercept('PUT', '/v0/in_progress_forms/1010ez', {});
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: format(new Date(), 'yyyy-MM-dd'),
      },
    }).as('mockSubmit');
  });

  it('should navigate and input maximal data using only a keyboard', () => {
    cy.wrap(maxTestData.data).as('testData');
    cy.get('@testData').then(data => {
      cy.visit(manifest.rootUrl);
      cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
      cy.injectAxeThenAxeCheck();

      cy.tabToElement('[href="#start"]');
      cy.realPress('Enter');

      cy.wait('@mockSip');
      cy.tabToElementAndPressSpace('.usa-button-primary');

      // Place of birth
      const { cityOfBirth, stateOfBirth } = data['view:placeOfBirth'];
      let prefix = '[name="root_view:placeOfBirth_';
      cy.typeInIfDataExists(`${prefix}cityOfBirth"]`, cityOfBirth);
      cy.typeInIfDataExists(`${prefix}stateOfBirth"]`, stateOfBirth);
      cy.tabToContinueForm();

      // Mothers maiden name
      cy.typeInIfDataExists(
        `[name="root_mothersMaidenName"]`,
        data.mothersMaidenName,
      );
      cy.tabToContinueForm();

      // Birth sex
      selectRadioWithKeyboard('gender', data.gender);
      cy.tabToContinueForm();

      // Race/Ethnicity/Origin
      prefix = '[name="root_view:demographicCategories_';
      cy.tabToElementAndPressSpace(
        `${prefix}isAmericanIndianOrAlaskanNative"]`,
      );
      cy.tabToElementAndPressSpace(`${prefix}isAsian"]`);
      cy.tabToElementAndPressSpace(`${prefix}isBlackOrAfricanAmerican"]`);
      cy.tabToElementAndPressSpace(`${prefix}isSpanishHispanicLatino"]`);
      cy.tabToElementAndPressSpace(
        `${prefix}isNativeHawaiianOrOtherPacificIslander"]`,
      );
      cy.tabToElementAndPressSpace(`${prefix}isWhite"]`);
      cy.tabToContinueForm();

      // Mailing address
      const mailingAddress = data.veteranAddress;
      fillAddressWithKeyboard('veteranAddress', mailingAddress);
      selectRadioWithKeyboard('view:doesMailingMatchHomeAddress', 'N');
      cy.tabToContinueForm();

      // Home address
      const homeAddress = data.veteranHomeAddress;
      fillAddressWithKeyboard('veteranHomeAddress', homeAddress);
      cy.tabToContinueForm();

      // Contact information
      cy.typeInIfDataExists('[name="root_email"]', data.email);
      cy.typeInIfDataExists('[name="root_homePhone"]', data.homePhone);
      cy.typeInIfDataExists('[name="root_mobilePhone"]', data.mobilePhone);
      cy.tabToContinueForm();

      // VA disability compensation
      selectRadioWithKeyboard('vaCompensationType', 'none');
      cy.tabToContinueForm();

      // VA pension
      selectRadioWithKeyboard('vaPensionType', 'No');
      cy.tabToContinueForm();

      // Military service
      selectDropdownWithKeyboard('lastServiceBranch', data.lastServiceBranch);
      fillDateWithKeyboard('lastEntryDate', data.lastEntryDate);
      fillDateWithKeyboard('lastDischargeDate', data.lastDischargeDate);
      selectDropdownWithKeyboard('dischargeType', data.dischargeType);
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
      const { gulfWarStartDate, gulfWarEndDate } = data[
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
        data.otherToxicExposure,
      );
      cy.tabToContinueForm();

      // Other toxic exposure dates
      const { toxicExposureStartDate, toxicExposureEndDate } = data[
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
      selectDropdownWithKeyboard('maritalStatus', data.maritalStatus);
      cy.tabToContinueForm();

      // Spouse's basic info
      fillNameWithKeyboard('spouseFullName', data.spouseFullName);
      cy.typeInIfDataExists(
        '[name="root_spouseSocialSecurityNumber"]',
        data.spouseSocialSecurityNumber,
      );
      fillDateWithKeyboard('spouseDateOfBirth', data.spouseDateOfBirth);
      fillDateWithKeyboard('dateOfMarriage', data.dateOfMarriage);
      cy.tabToContinueForm();

      // Spouse's addt'l info
      selectRadioWithKeyboard('cohabitedLastYear', 'Y');
      selectRadioWithKeyboard('sameAddress', 'N');
      cy.tabToContinueForm();

      // Spouse's contact info
      const { spouseAddress, spousePhone } = data[
        'view:spouseContactInformation'
      ];
      fillAddressWithKeyboard('spouseAddress', spouseAddress);
      cy.typeInIfDataExists('[name="root_spousePhone"]', spousePhone);
      cy.tabToContinueForm();

      // Dependents
      selectRadioWithKeyboard('view:reportDependents', 'Y');
      cy.tabToElementAndPressSpace('.usa-button-primary');

      // Dependent's basic info
      const dependent = data.dependents[0];
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
        data.medicarePartAEffectiveDate,
      );
      cy.typeInIfDataExists(
        '[name="root_medicareClaimNumber"]',
        data.medicareClaimNumber,
      );
      cy.tabToContinueForm();

      // Health insurance coverage
      selectRadioWithKeyboard('isCoveredByHealthInsurance', 'Y');

      const policy = data.providers[0];
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
      cy.tabToElementAndPressSpace('[name="root_isEssentialAcaCoverage"]');

      const { vaMedicalFacility, 'view:facilityState': facilityState } = data[
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
    });
  });
});
