import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address with a missing unit', () => {
    it('should successfully update on Desktop', () => {
      setUp('missing-unit');

      cy.get('#root_addressLine1')
        .clear()
        .type('225 irving st');
      cy.get('#root_addressLine2').clear();
      cy.get('#root_addressLine3').clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('San Francisco');
      cy.findByLabelText(/^State/).select('CA');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('94122');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.get('div[data-field-name="mailingAddress"]')
        .should('contain', 'Please add a unit number')
        .and('contain', '225 irving st');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.get('div[data-field-name="mailingAddress"]')
        .should('contain', '225 irving st')
        .and('contain', 'San Francisco, CA 94122');
    });
  });
});
