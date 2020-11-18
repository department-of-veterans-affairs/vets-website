import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address with a missing unit', () => {
    it('should successfully update on Desktop', () => {
      setUp('missing-unit');

      cy.get('#root_addressLine1')
        .clear()
        .type('225 irving st');
      cy.get('#root_addressLine2').clear();

      cy.get('#root_city')
        .clear()
        .type('San Francisco');
      cy.get('#root_stateCode').select('CA');
      cy.get('#root_zipCode')
        .clear()
        .type('94122');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.findByText('Please add a unit number').should('exist');
      cy.findByText('225 irving st').should('exist');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.findByText(/225 irving st/i).should('exist');
      cy.findByText(/San Francisco, CA 94122/i).should('exist');
    });
  });
});
