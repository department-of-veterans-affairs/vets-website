import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a valid address that needs confirmation', () => {
    it('should successfully update on Desktop', () => {
      setUp('confirm-address');

      cy.get('#root_addressLine1')
        .clear()
        .type('36310 Coronado Dr');

      cy.get('#root_addressLine2').clear();

      cy.get('#root_city')
        .clear()
        .type('Fremont');

      cy.get('#root_stateCode').select('CA');

      cy.get('#root_zipCode')
        .clear()
        .type('94536');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.findByText('Please confirm your address').should('exist');
      cy.findByText('36310 Coronado Dr').should('exist');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.findByText(/36310 Coronado Dr/i).should('exist');
      cy.findByText(/Fremont, CA 94536/i).should('exist');
    });
  });
});
