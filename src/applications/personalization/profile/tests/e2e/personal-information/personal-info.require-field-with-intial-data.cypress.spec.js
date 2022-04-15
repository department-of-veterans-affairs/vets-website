import { setup } from '@@profile/tests/e2e/personal-information/setup';

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
});
