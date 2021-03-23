import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering an address with a bad unit', () => {
    it('should successfully update on Desktop', () => {
      setUp('bad-unit');
      cy.axeCheck();

      cy.findByLabelText(/^street address/i)
        .clear()
        .type('225 irving st');
      cy.findByLabelText(/^line 2/i)
        .clear()
        .type('Unit A');

      cy.findByLabelText(/^line 3/i).clear();

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

      cy.axeCheck();

      cy.findByText('Please update or confirm your unit number').should(
        'exist',
      );

      cy.findByTestId('mailingAddress').should(
        'contain',
        '225 irving st, Unit A',
      );

      cy.findByTestId('confirm-address-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '225 irving st, Unit A')
        .and('contain', 'San Francisco, CA 94122');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
