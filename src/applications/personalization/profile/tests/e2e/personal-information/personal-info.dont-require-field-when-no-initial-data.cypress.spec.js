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
          'data.attributes.genderIdentity',
          { code: null, name: null },
        ),
      });
    });

    it('should show the Gender Identity field as not required and allow cancel', () => {
      cy.findByLabelText('Edit Gender identity')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.findByText('Select your gender identity').should('exist');

      cy.findByText(`(*Required)`).should('not.exist');

      cy.findByTestId('cancel-edit-button')
        .should('exist')
        .click({ waitForAnimations: true });

      cy.get('#root_genderIdentity-error-message').should('not.exist');

      cy.get('#root_genderIdentity-label').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
