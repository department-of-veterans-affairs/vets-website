import { setup } from '@@profile/tests/e2e/personal-information/setup';
import mockPersonalInformationEnhanced from '@@profile/tests/fixtures/personal-information-success-enhanced.json';
import set from 'lodash/set';

describe('Personal information', () => {
  describe('require field when initial data is present from api call', () => {
    beforeEach(() => {
      setup({ isEnhanced: true });
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

  describe('require a Gender Identity selection when initial data is not present from api call and update is attempted on empty selection', () => {
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
        .contains('You must select a valid option')
        .should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
