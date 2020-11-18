import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering an address with a bad unit', () => {
    it('should successfully update on Desktop', () => {
      setUp('bad-unit');

      cy.get('#root_addressLine1')
        .clear()
        .type('225 irving st');
      cy.get('#root_addressLine2')
        .clear()
        .type('Unit A');

      cy.findByLabelText(/City/i)
        .clear()
        .type('San Francisco');
      cy.get('#root_stateCode').select('CA');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('94122');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.findByText('Please update or confirm your unit number').should(
        'exist',
      );
      cy.findByText('225 irving st, Unit A').should('exist');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.findByText(/225 irving st, Unit A/i).should('exist');
      cy.findByText(/San Francisco, CA 94122/i).should('exist');
    });
  });
});
