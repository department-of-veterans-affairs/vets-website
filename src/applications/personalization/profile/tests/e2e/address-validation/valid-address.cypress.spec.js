import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('should successfully update on Desktop', () => {
    describe('when entering a valid home address', () => {
      it('should update successfully without showing the validation screen', () => {
        setUp('valid-address');

        cy.get('#root_addressLine1')
          .clear()
          .type('36320 Coronado Dr');
        cy.get('#root_addressLine2').clear();
        cy.get('#root_addressLine3').clear();

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

        cy.wait('@getUser');

        cy.findByTestId('mailingAddress')
          .should('contain', '36320 Coronado Dr')
          .and('contain', 'Fremont, CA 94536');

        cy.findByRole('button', { name: /edit mailing address/i }).should(
          'be.focused',
        );
      });
    });
  });
});
