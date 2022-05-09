import { setup } from '@@profile/tests/e2e/personal-information/setup';
import mockPersonalInformationEnhanced from '@@profile/tests/fixtures/personal-information-success-enhanced.json';
import set from 'lodash/set';

describe('Personal information', () => {
  describe('require field when initial data is present from api call', () => {
    beforeEach(() => {
      setup({ isEnhanced: true });
    });

    it('should show the preferred name field as required and display error when update is attempted', () => {
      cy.findByLabelText('Edit Preferred name')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.findByText(
        'Provide your preferred name (25 characters maximum)',
      ).should('exist');

      cy.findByText(`(*Required)`).should('exist');

      // if we clear the field and attempt to update the error should appear
      cy.get('input[name="root_preferredName"]')
        .should('exist')
        .clear();

      cy.findByTestId('save-edit-button')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.get('#root_preferredName-error-message')
        .should('exist')
        .should('contain', 'Please provide a response');

      cy.injectAxeThenAxeCheck();
    });

    it('should show the Gender Identity field as required', () => {
      cy.findByLabelText('Edit Gender identity')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.findByText('Select your gender identity').should('exist');

      cy.findByText(`(*Required)`).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  describe('require Gender Identity when initial data is not present from api call and update is attempted on empty selection', () => {
    it('should show and error and not allow update without selecting option or cancelling out of edit mode', () => {
      setup({
        isEnhanced: true,
        personalData: set(
          mockPersonalInformationEnhanced,
          'data.attributes.genderIdentity',
          { code: null, name: null },
        ),
      });

      cy.findByLabelText('Edit Gender identity')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.findByText('Select your gender identity').should('exist');

      cy.findByText(`(*Required)`).should('not.exist');

      cy.findByTestId('save-edit-button')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.get('#root_genderIdentity-error-message')
        .contains('Please select a valid option')
        .should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
