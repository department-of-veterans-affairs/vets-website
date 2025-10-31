import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user.json';
import mockBasicPrefill from './fixtures/mocks/mock-prefill.json';
import mockPrefillWithNonPrefillData from './fixtures/mocks/mock-prefill-with-non-prefill-data.json';
import maxTestData from './fixtures/data/maximal-test.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { goToNextPage, selectYesNoWebComponent } from './helpers';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import {
  advanceToHouseholdSection,
  fillSpousePersonalInformation,
  fillSpouseContactInformation,
  fillSpouseFinancialSupport,
  fillSpouseAdditionalInformation,
} from './helpers/household';

const { data: testData } = maxTestData;

// Add the feature toggle for the V2 spouse confirmation flow.
featureToggles.data.features.push({
  name: 'ezrSpouseConfirmationFlowEnabled',
  value: true,
});

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
  goToNextPage('/household-information/marital-status-information');
  cy.injectAxeThenAxeCheck();
}

describe('EZR V2 spouse information flow', () => {
  beforeEach(() => {
    setUserDataAndAdvanceToSpouseSection(mockUser, mockBasicPrefill);
  });

  context('when the Veteran is married or separated', () => {
    it('should successfully fill the marital information', () => {
      // Verify the marital status select field is empty/unset.
      cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
        .shadow()
        .find('select')
        .should('have.value', '');

      // Verify that the form cannot be submitted without selecting a value.
      // Click the continue button.
      cy.findAllByText(/continue/i, { selector: 'button' }).click();
      cy.location('pathname').should(
        'include',
        '/household-information/marital-status-information',
      );
      // Look for error text: 'You must select a valid option'
      cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
        .shadow()
        .find('span.usa-error-message')
        .should('contain', 'You must select a valid option');

      // Fill the marital information.
      cy.selectVaSelect('root_view:maritalStatus_maritalStatus', 'Married');

      // Verify the marital status select field is set to Married.
      cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
        .shadow()
        .find('select')
        .should('have.value', 'Married');

      // Go to spouse information page.
      goToNextPage('/household-information/spouse-information');

      // Fill the spouse information with 'Yes' value using the helper function.
      selectYesNoWebComponent('view:hasSpouseInformationToAdd', true);

      // Click continue to advance to the spouse personal information page.
      goToNextPage(
        'household-information/spouse-information/0/personal-information',
      );

      // Fill the spouse personal information.
      fillSpousePersonalInformation();

      // Axe check.
      cy.injectAxeThenAxeCheck();

      // Continue to spouse additional information page.
      goToNextPage(
        'household-information/spouse-information/0/additional-information',
      );

      // Fill spouse additional information.
      fillSpouseAdditionalInformation(testData);

      // Axe check.
      cy.injectAxeThenAxeCheck();

      // Continue to spouse financial support page.
      goToNextPage(
        'household-information/spouse-information/0/financial-support',
      );

      // Fill spouse financial support.
      fillSpouseFinancialSupport(testData?.provideSupportLastYear);

      // Axe check.
      cy.injectAxeThenAxeCheck();

      // Continue to spouse contact information page.
      goToNextPage(
        'household-information/spouse-information/0/contact-information',
      );

      // Fill spouse contact information.
      fillSpouseContactInformation(testData['view:spouseContactInformation']);

      // Axe check.
      cy.injectAxeThenAxeCheck();

      // Continue back to spouse information summary page.
      goToNextPage('household-information/spouse-information');

      // Verify the review card is present on review page.
      cy.get('h3').should('contain', 'Review your spouse');

      // Final axe check.
      cy.injectAxeThenAxeCheck();
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

  context('when there is prefilled spouse data', () => {
    beforeEach(() => {
      setUserDataAndAdvanceToSpouseSection(
        mockUser,
        mockPrefillWithNonPrefillData,
      );
    });
    it('should edit the existing spouse information', () => {
      // Verify the marital status select field is set to Married
      cy.get('va-select[name="root_view:maritalStatus_maritalStatus"]')
        .shadow()
        .find('select')
        .should('have.value', 'Married');

      // The spouse section should be skipped, taking us to the dependents page.
      // Axe check.
      goToNextPage('household-information/spouse-information');

      // There should be no delete button.
      cy.findAllByRole('button', {
        name: /delete/i,
      }).should('not.exist');

      // Click the edit button.
      cy.get('va-link[text="Edit"]').click();

      // Verify we are on the spouse edit page.
      cy.get('h3').should('contain', 'Edit spouse information');

      // Fill the spouse information.
      fillSpousePersonalInformation();

      // Axe check.
      cy.injectAxeThenAxeCheck();
    });
  });
});
