import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a home address with a missing unit', () => {
    it('should successfully update on Desktop', () => {
      setUp('missing-unit');

      cy.findByLabelText(/^street address \(/i)
        .clear()
        .type('225 irving st');
      cy.findByLabelText(/^street address line 2/i).clear();
      cy.findByLabelText(/^street address line 3/i).clear();

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

      cy.findByTestId('mailingAddress')
        .should('contain', 'Please add a unit number')
        .and('contain', '225 irving st');

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '225 irving st')
        .and('contain', 'San Francisco, CA 94122');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
