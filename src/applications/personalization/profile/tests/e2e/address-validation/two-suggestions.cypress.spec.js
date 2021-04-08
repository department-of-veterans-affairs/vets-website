import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address that has two suggestions', () => {
    it('should successfully update on Desktop', () => {
      setUp('two-suggestions');

      cy.findByLabelText(/^street address \(/i)
        .clear()
        .type('575 20th');
      cy.findByLabelText(/^street address line 2/i).clear();
      cy.findByLabelText(/^street address line 3/i).clear();

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

      cy.findByText('Please confirm your address').should('exist');

      cy.findByTestId('mailingAddress')
        .should('contain', 'Please confirm your address')
        .and('contain', '575 20th')
        .and('contain', '575 20th Ave')
        .and('contain', '575 20th St');

      // Confirm we choose the first option (default)
      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '575 20th St')
        .and('contain', 'San Francisco, CA 94107');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
