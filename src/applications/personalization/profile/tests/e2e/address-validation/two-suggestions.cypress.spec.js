import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address that has two suggestions', () => {
    it('should successfully update on Desktop', () => {
      setUp('two-suggestions');

      cy.get('#root_addressLine1')
        .clear()
        .type('575 20th');
      cy.get('#root_addressLine2').clear();
      cy.get('#root_addressLine3').clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('San Francisco');
      cy.findByLabelText(/^State/).select('CA');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('12345');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.wait('@validateAddress');

      cy.findByText('Please confirm your address').should('exist');

      cy.get('div[data-field-name="mailingAddress"]')
        .should('contain', 'Please confirm your address')
        .and('contain', '575 20th')
        .and('contain', '575 20th Ave')
        .and('contain', '575 20th St');

      // Confirm we choose the first option (default)
      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.wait('@saveAddress');
      cy.wait('@finishedTransaction');
      cy.wait('@getUser');

      cy.get('div[data-field-name="mailingAddress"]')
        .should('contain', '575 20th St')
        .and('contain', 'San Francisco, CA 94107');
    });
  });
});
