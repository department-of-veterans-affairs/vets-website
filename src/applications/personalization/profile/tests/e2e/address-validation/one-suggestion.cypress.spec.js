import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address that has one suggestion', () => {
    it('should successfully update on Desktop', () => {
      setUp('one-suggestion');

      cy.get('#root_addressLine1')
        .clear()
        .type('400 65th st');
      cy.get('#root_addressLine2').clear();

      cy.get('#root_city')
        .clear()
        .type('Seattle');
      cy.get('#root_stateCode').select('WA');
      cy.get('#root_zipCode')
        .clear()
        .type('12345');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.findByText('Please confirm your address').should('exist');
      cy.findByText('400 65th st').should('exist');
      cy.findByText('400 NW 65th St').should('exist');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.findByText(/400 NW 65th St/i).should('exist');
      cy.findByText(/Seattle, WA 98117/i).should('exist');
    });
  });
});
