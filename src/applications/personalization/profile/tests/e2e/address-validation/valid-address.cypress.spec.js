import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

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

        cy.wait('@validateAddress');
        cy.wait('@saveAddress');
        cy.wait('@finishedTransaction');
        cy.wait('@getUser');

        cy.get('div[data-field-name="mailingAddress"]')
          .should('contain', '36320 Coronado Dr')
          .and('contain', 'Fremont, CA 94536');
      });
    });
  });
});
