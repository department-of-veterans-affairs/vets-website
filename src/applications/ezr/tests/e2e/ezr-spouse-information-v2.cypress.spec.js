import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockBasicPrefill from './fixtures/mocks/mock-prefill.json';
import mockPrefillWithNonPrefillData from './fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage, selectYesNoWebComponent } from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import { advanceToHouseholdSection } from './helpers/household';
// import {
//   fillVeteranIncome,
//   fillSpousalIncome,
//   fillDeductibleExpenses,
// } from './utils/fillers';

// Add the feature toggle for the V2 spouse confirmation flow.
featureToggles.data.features.push({
  name: 'ezrSpouseConfirmationFlowEnabled',
  value: true,
});

function advanceToSpouseInformationPage() {
  goToNextPage('/household-information/spouse-information');
}

function setUserDataAndAdvanceToSpouseSection(user, prefillData) {
  cy.login(user);
  cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
    'mockFeatures',
  );
  cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
    statusCode: 200,
    body: MOCK_ENROLLMENT_RESPONSE,
  }).as('mockEnrollmentStatus');
  cy.intercept('/v0/in_progress_forms/10-10EZR', {
    statusCode: 200,
    body: prefillData,
  }).as('mockSip');
  cy.visit(manifest.rootUrl);
  cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
  advanceToHouseholdSection();
  goToNextPage('/military-service/toxic-exposure');
  cy.get('[name="root_hasTeraResponse"]').check('N');
  goToNextPage('/household-information/marital-status');
  cy.injectAxeThenAxeCheck();
}

// Helper function to fill spouse personal information
const fillSpousePersonalInformation = () => {
  // Fill spouse full name using cy.fill with force: true
  cy.get('va-text-input[name="root_spouseFullName_first"]')
    .shadow()
    .find('input')
    .type('John', { force: true });
  cy.get('va-text-input[name="root_spouseFullName_last"]')
    .shadow()
    .find('input')
    .type('Doe', { force: true });

  // Fill spouse SSN
  cy.get('va-text-input[name="root_spouseSocialSecurityNumber"]')
    .shadow()
    .find('input')
    .type('123422222', { force: true });

  // Fill spouse date of birth using the existing helper
  cy.get('va-memorable-date[name="root_spouseDateOfBirth"]')
    .shadow()
    .find('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .select('1');
  cy.get('va-memorable-date[name="root_spouseDateOfBirth"]')
    .shadow()
    .find('va-text-input.usa-form-group--day-input')
    .shadow()
    .find('input')
    .type('1', { force: true });
  cy.get('va-memorable-date[name="root_spouseDateOfBirth"]')
    .shadow()
    .find('va-text-input.usa-form-group--year-input')
    .shadow()
    .find('input')
    .type('1990', { force: true });

  // Fill date of marriage
  cy.get('va-memorable-date[name="root_dateOfMarriage"]')
    .shadow()
    .find('va-select.usa-form-group--month-select')
    .shadow()
    .find('select')
    .select('6');
  cy.get('va-memorable-date[name="root_dateOfMarriage"]')
    .shadow()
    .find('va-text-input.usa-form-group--day-input')
    .shadow()
    .find('input')
    .type('15', { force: true });
  cy.get('va-memorable-date[name="root_dateOfMarriage"]')
    .shadow()
    .find('va-text-input.usa-form-group--year-input')
    .shadow()
    .find('input')
    .type('2015', { force: true });
};

// Helper function to fill spouse additional information
const fillSpouseAdditionalInformation = () => {
  // Wait for the field to exist and be visible
  cy.get('va-radio-option[name="root_cohabitedLastYear"]')
    .should('exist')
    .and('be.visible');
  // Select No for cohabited last year to trigger financial support page
  selectYesNoWebComponent('cohabitedLastYear', false);

  // Wait for the next field
  cy.get('va-radio-option[name="root_sameAddress"]')
    .should('exist')
    .and('be.visible');
  // Select No for same address to trigger contact information page
  selectYesNoWebComponent('sameAddress', false);
};

// Helper function to fill spouse financial support
const fillSpouseFinancialSupport = () => {
  // Wait for the field to exist and be visible.
  cy.get('va-radio-option[name="root_provideSupportLastYear"]')
    .should('exist')
    .and('be.visible');
  // Select Yes for provided support last year
  selectYesNoWebComponent('provideSupportLastYear', true);
};

// Helper function to fill spouse contact information
const fillSpouseContactInformation = () => {
  // Fill spouse address

  cy.get('va-text-input[name="root_spouseAddress_street"]')
    .shadow()
    .find('input')
    .type('123 Main St', { force: true });
  cy.get('va-text-input[name="root_spouseAddress_city"]')
    .shadow()
    .find('input')
    .type('Anytown', { force: true });
  cy.get('va-text-input[name="root_spouseAddress_state"]')
    .shadow()
    .find('input')
    .type('CA');
  cy.get('va-text-input[name="root_spouseAddress_postalCode"]')
    .shadow()
    .find('input')
    .type('12345', { force: true });

  // Fill spouse phone
  cy.get('va-text-input[name="root_spousePhone"]')
    .shadow()
    .find('input')
    .type('5551234567', { force: true });

  cy.get('va-select[name="root_spouseAddress_country"]')
    .shadow()
    .find('select')
    .select('United States');
};

describe('EZR V2 spouse information flow', () => {
  beforeEach(() => {
    setUserDataAndAdvanceToSpouseSection(
      mockUser,
      mockPrefillWithNonPrefillData,
    );
  });

  context('when the Veteran is married or separated', () => {
    context('with no spouse prefill data', () => {
      beforeEach(() => {
        setUserDataAndAdvanceToSpouseSection(mockUser, mockBasicPrefill);
      });

      it('should successfully fill the marital information', () => {
        // Verify the marital status select field is empty/unset
        cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
          .shadow()
          .find('select')
          .should('have.value', '');

        // Fill the marital information.
        cy.selectVaSelect('root_view:maritalStatus_maritalStatus', 'Married');

        // Verify the marital status select field is set to Married
        cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
          .shadow()
          .find('select')
          .should('have.value', 'Married');

        // Go to spouse information page.
        advanceToSpouseInformationPage();

        // Fill the spouse information with 'Yes' value using the helper function
        selectYesNoWebComponent('view:hasSpouseInformationToAdd', true);

        // Click continue to advance to the spouse personal information page
        goToNextPage(
          'household-information/spouse-information/0/spouse-personal-information',
        );

        // Fill the spouse personal information.
        fillSpousePersonalInformation();

        // Axe check.
        cy.injectAxeThenAxeCheck();

        // Continue to spouse additional information page
        goToNextPage();

        // Fill spouse additional information
        fillSpouseAdditionalInformation();

        // Axe check.
        cy.injectAxeThenAxeCheck();

        // Continue to spouse financial support page
        goToNextPage();

        // Fill spouse financial support
        fillSpouseFinancialSupport();

        // Axe check.
        cy.injectAxeThenAxeCheck();

        // Continue to spouse contact information page
        goToNextPage();

        // Fill spouse contact information
        fillSpouseContactInformation();

        // Axe check.
        cy.injectAxeThenAxeCheck();

        // Continue back to spouse information summary page
        goToNextPage();

        // Verify we're back at the summary page
        cy.url().should('include', 'household-information/spouse-information');
        cy.get('h3').should('contain', 'Review your spouse');

        // Final axe check.
        cy.injectAxeThenAxeCheck();
      });
    });
  });

  context('when the Veteran is not married or separated', () => {
    it('should skip the spouse information page', () => {
      // Verify the marital status select field is empty/unset
      cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
        .shadow()
        .find('select')
        .should('have.value', '');

      // Fill the marital information.
      cy.selectVaSelect(
        'root_view:maritalStatus_maritalStatus',
        'Never Married',
      );

      // The spouse section should be skipped, taking us to the dependents page.
      // Axe check.
      goToNextPage('household-information/dependents');

      // Axe check.
      cy.injectAxeThenAxeCheck();
    });
  });
});
