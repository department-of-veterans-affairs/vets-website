import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when getting a single suggestion with a confidence score <90', () => {
    it('should show the validation view and successfully update', () => {
      setUp('low-confidence');

      cy.findByLabelText(/^street address/i)
        .clear()
        .type('36320 Coronado Dr');

      cy.findByLabelText(/^line 2/i).clear();
      cy.findByLabelText(/^line 3/i).clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('Fremont');

      cy.findByLabelText(/^State/).select('CA');

      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('94530');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '36320 Coronado Dr')
        .should('contain', 'Fremont, CA 94530')
        .should('contain', '36320 Coronado Dr')
        .should('contain', 'Fremont, CA 94536')
        .and('contain', 'Please confirm your address');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '36320 Coronado Dr')
        .and('contain', 'Fremont, CA 94536');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
