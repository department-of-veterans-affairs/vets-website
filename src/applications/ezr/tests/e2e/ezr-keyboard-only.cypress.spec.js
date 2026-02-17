import { format, subYears } from 'date-fns';
import manifest from '../../manifest.json';
import formConfig from '../../config/form';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { MOCK_ENROLLMENT_RESPONSE, API_ENDPOINTS } from '../../utils/constants';

import { disableConfirmationOnLocal } from './helpers/disableConfirmationOnLocal';
import {
  fillAddressWithKeyboard,
  fillNameWithKeyboard,
  fillPhoneNumberWithKeyboard,
  fillDateWithKeyboard,
  selectRadioWithKeyboard,
  selectDropdownWithKeyboard,
} from './helpers';

describe('Form 10-10EZR Keyboard Only', () => {
  // NOTE: This test is skipped in CI due to a limitation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    disableConfirmationOnLocal();

    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', `/v0${API_ENDPOINTS.enrollmentStatus}*`, {
      statusCode: 200,
      body: MOCK_ENROLLMENT_RESPONSE,
    }).as('mockEnrollmentStatus');
    cy.intercept('GET', '/v0/in_progress_forms/10-10EZR', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
    cy.intercept('PUT', '/v0/in_progress_forms/10-10EZR', {});
    cy.intercept('POST', formConfig.submitUrl, {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
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

      // Mailing address
      const mailingAddress = data.veteranAddress;
      fillAddressWithKeyboard('veteranAddress', mailingAddress);
      selectRadioWithKeyboard('view:doesMailingMatchHomeAddress', 'Y');
      cy.tabToContinueForm();

      // Contact information
      const { email, homePhone, mobilePhone } = data['view:contactInformation'];
      cy.typeInIfDataExists(
        '[name="root_view:contactInformation_email"]',
        email,
      );
      cy.typeInIfDataExists(
        '[name="root_view:contactInformation_homePhone"]',
        homePhone,
      );
      cy.typeInIfDataExists(
        '[name="root_view:contactInformation_mobilePhone"]',
        mobilePhone,
      );
      cy.tabToContinueForm();

      // Start of Emergency Contacts section
      selectRadioWithKeyboard('view:hasEmergencyContacts', 'Y');
      cy.tabToElementAndPressSpace('.usa-button-primary'); // Proceed to add a contact

      // Use the first contact from your data
      const contact = data.emergencyContacts[0];

      // Fill in the contact's basic info
      fillNameWithKeyboard('fullName', contact.fullName);

      // Fill in relationship
      selectDropdownWithKeyboard('relationship', contact.relationship);

      // Fill in primary phone number
      fillPhoneNumberWithKeyboard('primaryPhone', contact.primaryPhone);
      cy.tabToContinueForm();

      // Fill in address
      fillAddressWithKeyboard('address', contact.address);

      // Save the contact
      cy.tabToElementAndPressSpace('.usa-button-primary'); // Save contact

      // On the summary page, select 'No' to indicate no more contacts
      selectRadioWithKeyboard('view:hasEmergencyContacts', 'N');
      cy.tabToContinueForm(); // Proceed to next section

      // Start of Next of Kin section
      selectRadioWithKeyboard('view:hasNextOfKin', 'Y');
      cy.tabToElementAndPressSpace('.usa-button-primary'); // Proceed to add a contact

      // Fill in the contact's basic info
      fillNameWithKeyboard('fullName', contact.fullName);

      // Fill in relationship
      selectDropdownWithKeyboard('relationship', contact.relationship);

      // Fill in primary phone number
      fillPhoneNumberWithKeyboard('primaryPhone', contact.primaryPhone);
      cy.tabToContinueForm();

      // Fill in address
      fillAddressWithKeyboard('address', contact.address);

      // Save the contact
      cy.tabToElementAndPressSpace('.usa-button-primary'); // Save contact

      // On the summary page, select 'No' to indicate no more contacts
      selectRadioWithKeyboard('view:hasNextOfKin', 'N');
      cy.tabToContinueForm(); // Proceed to next section

      // Toxic exposure
      selectRadioWithKeyboard('hasTeraResponse', 'Y');
      cy.tabToContinueForm();

      // Radiation clean-up
      selectRadioWithKeyboard('radiationCleanupEfforts', 'Y');
      cy.tabToContinueForm();

      // Gulf War service
      selectRadioWithKeyboard('gulfWarService', 'Y');
      cy.tabToContinueForm();

      // Gulf War service dates
      const { gulfWarStartDate, gulfWarEndDate } = data[
        'view:gulfWarServiceDates'
      ];

      let [year, month] = gulfWarStartDate
        .split('-')
        .map(num => parseInt(num, 10).toString());
      cy.tabToElement(
        `[name="root_view:gulfWarServiceDates_gulfWarStartDateMonth"]`,
      );
      cy.chooseSelectOptionUsingValue(month);
      cy.typeInIfDataExists(
        '[name="root_view:gulfWarServiceDates_gulfWarStartDateYear"]',
        year,
      );

      [year, month] = gulfWarEndDate
        .split('-')
        .map(num => parseInt(num, 10).toString());
      cy.tabToElement(
        `[name="root_view:gulfWarServiceDates_gulfWarEndDateMonth"]`,
      );
      cy.chooseSelectOptionUsingValue(month);
      cy.typeInIfDataExists(
        '[name="root_view:gulfWarServiceDates_gulfWarEndDateYear"]',
        year,
      );

      cy.tabToContinueForm();

      // Combat Operation service
      selectRadioWithKeyboard('combatOperationService', 'N');
      cy.tabToContinueForm();

      // Agent Orange exposure
      selectRadioWithKeyboard('exposedToAgentOrange', 'N');
      cy.tabToContinueForm();

      // Other toxic exposures
      let prefix = '[name="root_view:otherToxicExposures_';
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
      [year, month] = toxicExposureStartDate
        .split('-')
        .map(num => parseInt(num, 10).toString());
      cy.tabToElement(
        `[name="root_view:toxicExposureDates_toxicExposureStartDateMonth"]`,
      );
      cy.chooseSelectOptionUsingValue(month);
      cy.typeInIfDataExists(
        '[name="root_view:toxicExposureDates_toxicExposureStartDateYear"]',
        year,
      );

      [year, month] = toxicExposureEndDate
        .split('-')
        .map(num => parseInt(num, 10).toString());
      cy.tabToElement(
        `[name="root_view:toxicExposureDates_toxicExposureEndDateMonth"]`,
      );
      cy.chooseSelectOptionUsingValue(month);
      cy.typeInIfDataExists(
        '[name="root_view:toxicExposureDates_toxicExposureEndDateYear"]',
        year,
      );
      cy.tabToContinueForm();

      // Toxic exposure document upload, skip for now
      cy.tabToContinueForm();

      // Marital status
      const { maritalStatus } = data['view:maritalStatus'];
      selectDropdownWithKeyboard(
        'view:maritalStatus_maritalStatus',
        maritalStatus,
      );
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
      selectRadioWithKeyboard(
        'view:isMedicaidEligible_isMedicaidEligible',
        'Y',
      );
      cy.tabToContinueForm();

      // Medicare enrollment
      selectRadioWithKeyboard(
        'view:isEnrolledMedicarePartA_isEnrolledMedicarePartA',
        'Y',
      );
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
      selectRadioWithKeyboard('view:addInsurancePolicy', 'Y');
      cy.tabToElementAndPressSpace('.usa-button-primary');

      const policy = data.providers[0];
      prefix = '[name="root_';
      cy.typeInIfDataExists(`${prefix}insuranceName"]`, policy.insuranceName);
      cy.typeInIfDataExists(
        `${prefix}insurancePolicyHolderName"]`,
        policy.insurancePolicyHolderName,
      );
      cy.typeInIfDataExists(
        `${prefix}view:policyOrGroup_insurancePolicyNumber"]`,
        policy.insurancePolicyNumber,
      );
      cy.tabToContinueForm();

      selectRadioWithKeyboard('view:addInsurancePolicy', 'N');
      cy.tabToElementAndPressSpace('.usa-button-primary');

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

describe("Form 10-10EZR Keyboard Only, with the 'ezrFormPrefillWithProvidersAndDependents' toggle enabled", () => {
  const updatedFeatureToggles = {
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'ezrProdEnabled',
          value: true,
        },
        {
          name: 'ezrFormPrefillWithProvidersAndDependents',
          value: true,
        },
      ],
    },
  };

  // NOTE: This test is skipped in CI due to a limitation with Electron not allowing
  // `realPress` to be utilized
  // eslint-disable-next-line func-names
  beforeEach(function() {
    if (Cypress.env('CI')) this.skip();

    disableConfirmationOnLocal();

    cy.login(mockUser);
    cy.intercept('GET', '/v0/feature_toggles*', updatedFeatureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', `/v0${API_ENDPOINTS.enrollmentStatus}*`, {
      statusCode: 200,
      body: MOCK_ENROLLMENT_RESPONSE,
    }).as('mockEnrollmentStatus');
    cy.intercept('GET', '/v0/in_progress_forms/10-10EZR', {
      statusCode: 200,
      body: mockPrefill,
    }).as('mockSip');
    cy.intercept('PUT', '/v0/in_progress_forms/10-10EZR', {});
    cy.intercept('POST', formConfig.submitUrl, {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      },
    }).as('mockSubmit');
  });

  it('should navigate and input V2 financial information using only a keyboard', () => {
    cy.wrap(maxTestData.data).as('testData');
    cy.get('@testData').then(data => {
      cy.visit(manifest.rootUrl);

      cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
      cy.injectAxeThenAxeCheck();

      cy.tabToElement('[href="#start"]');
      cy.realPress('Enter');

      cy.wait('@mockSip');
      cy.tabToElementAndPressSpace('.usa-button-primary');

      // Mailing address
      const mailingAddress = data.veteranAddress;
      fillAddressWithKeyboard('veteranAddress', mailingAddress);
      selectRadioWithKeyboard('view:doesMailingMatchHomeAddress', 'Y');
      cy.tabToContinueForm();

      // Contact information
      const { email, homePhone, mobilePhone } = data['view:contactInformation'];
      cy.typeInIfDataExists(
        '[name="root_view:contactInformation_email"]',
        email,
      );
      cy.typeInIfDataExists(
        '[name="root_view:contactInformation_homePhone"]',
        homePhone,
      );
      cy.typeInIfDataExists(
        '[name="root_view:contactInformation_mobilePhone"]',
        mobilePhone,
      );
      cy.tabToContinueForm();

      // Skip toxic exposure
      selectRadioWithKeyboard('hasTeraResponse', 'N');
      cy.tabToContinueForm();

      // Marital status
      const { maritalStatus } = data['view:maritalStatus'];
      selectDropdownWithKeyboard(
        'view:maritalStatus_maritalStatus',
        maritalStatus,
      );
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
      selectRadioWithKeyboard('sameAddress', 'Y');
      cy.tabToContinueForm();

      // Skip dependents
      selectRadioWithKeyboard('view:reportDependents', 'N');
      cy.tabToElementAndPressSpace('.usa-button-primary');

      // --- V2 financial section start ---
      // Financial introduction
      cy.tabToContinueForm();

      // Add financial information
      selectRadioWithKeyboard('view:hasFinancialInformationToAdd', 'Y');
      cy.tabToContinueForm();

      let prefix = '';
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

      // On review page, edit the financial information
      cy.tabToElement('va-card a');
      cy.realPress('Enter');

      // Veteran's income
      prefix = '[name="root_view:veteranGrossIncome_veteran';
      cy.typeInIfDataExists(`${prefix}GrossIncome"]`, '654');

      prefix = '[name="root_view:veteranNetIncome_veteran';
      cy.typeInIfDataExists(`${prefix}NetIncome"]`, '343');

      prefix = '[name="root_view:veteranOtherIncome_veteran';
      cy.typeInIfDataExists(`${prefix}OtherIncome"]`, '631');
      cy.tabToContinueForm();

      // Spouse's income
      prefix = '[name="root_view:spouseGrossIncome_spouse';
      cy.typeInIfDataExists(`${prefix}GrossIncome"]`, '235');

      prefix = '[name="root_view:spouseNetIncome_spouse';
      cy.typeInIfDataExists(`${prefix}NetIncome"]`, '254');

      prefix = '[name="root_view:spouseOtherIncome_spouse';
      cy.typeInIfDataExists(`${prefix}OtherIncome"]`, '674');
      cy.tabToContinueForm();

      // Deductible expenses
      prefix = '[name="root_view:deductibleMedicalExpenses_deductible';
      cy.typeInIfDataExists(`${prefix}MedicalExpenses"]`, '456');

      prefix = '[name="root_view:deductibleEducationExpenses_deductible';
      cy.typeInIfDataExists(`${prefix}EducationExpenses"]`, '645');

      prefix = '[name="root_view:deductibleFuneralExpenses_deductible';
      cy.typeInIfDataExists(`${prefix}FuneralExpenses"]`, '454');
      cy.tabToContinueForm();

      // Review page
      cy.tabToContinueForm();

      // --- V2 financial section end ---

      // Medicaid eligibility
      selectRadioWithKeyboard(
        'view:isMedicaidEligible_isMedicaidEligible',
        'Y',
      );
      cy.tabToContinueForm();
    });
  });
});
