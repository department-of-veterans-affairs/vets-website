import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a military address', () => {
    it('should successfully update on Desktop', () => {
      setUp('military');

      cy.get('[type="checkbox"]')
        .first()
        .check();

      cy.get('#root_addressLine1')
        .clear()
        .type('PSC 808 Box 37');
      cy.get('#root_addressLine2').clear();

      cy.get('#root_city').select('FPO');

      cy.get('#root_stateCode').select('AE');
      cy.get('#root_zipCode')
        .clear()
        .type('09618');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.findByText(/PSC 808 Box 37/i).should('exist');
      cy.findByText(/FPO, Armed Forces Europe/i).should('exist');
    });
  });
});
