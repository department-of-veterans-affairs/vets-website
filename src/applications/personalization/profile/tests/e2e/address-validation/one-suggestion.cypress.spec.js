import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address that has one suggestion', () => {
    it('should successfully update on Desktop', () => {
      setUp('one-suggestion');

      cy.get('#root_addressLine1')
        .clear()
        .type('400 65th st');
      cy.get('#root_addressLine2').clear();
      cy.get('#root_addressLine3').clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('Seattle');
      cy.findByLabelText(/^State/).select('WA');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('12345');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.get('div[data-field-name="mailingAddress"]')
        .should('contain', 'Please confirm your address')
        .and('contain', '400 65th st')
        .and('contain', '400 NW 65th St');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });
      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.get('div[data-field-name="mailingAddress"]')
        .should('contain', '400 NW 65th St')
        .and('contain', 'Seattle, WA 98117');
    });
  });
});
