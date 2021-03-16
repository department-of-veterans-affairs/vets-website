import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a valid address that needs confirmation', () => {
    it('should successfully update on Desktop', () => {
      setUp('confirm-address');

      cy.findByLabelText(/^street address/i)
        .clear()
        .type('36310 Coronado Dr');

      cy.findByLabelText(/^line 2/i).clear();
      cy.findByLabelText(/^line 3/i).clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('Fremont');

      cy.findByLabelText(/^State/).select('CA');

      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('94536');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '36310 Coronado Dr')
        .and('contain', 'Please confirm your address');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '36310 Coronado Dr')
        .and('contain', 'Fremont, CA 94536');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
