import { setup } from '@@profile/tests/e2e/personal-information/setup';
import mockPersonalInformationEnhanced from '@@profile/tests/fixtures/personal-information-success-enhanced.json';
import set from 'lodash/set';

describe('Personal information', () => {
  describe('dont require field when initial data is not present from api call', () => {
    beforeEach(() => {
      setup({
        isEnhanced: true,
        personalData: set(
          mockPersonalInformationEnhanced,
          'data.attributes.preferredName',
          '',
        ),
      });
    });

    it('should show the preferred name field as not required and allow cancel', () => {
      cy.findByLabelText('Edit Preferred name')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.findByText(
        'Provide your preferred name (25 characters maximum)',
      ).should('exist');

      cy.findByText(`(*Required)`).should('not.exist');

      // if we clear the field and attempt to update the error should appear
      cy.get('input[name="root_preferredName"]')
        .should('exist')
        .clear();

      cy.findByTestId('cancel-edit-button')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.get('#root_preferredName-error-message').should('not.exist');

      cy.get('input[name="root_preferredName"]').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
