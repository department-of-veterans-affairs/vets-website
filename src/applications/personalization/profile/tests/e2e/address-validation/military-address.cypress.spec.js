import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering a military address', () => {
    it('should successfully update on Desktop', () => {
      setUp('military');

      cy.findByRole('checkbox', {
        name: /I live on a.*military base/i,
      }).check();

      cy.get('#root_addressLine1')
        .clear()
        .type('PSC 808 Box 37');
      cy.get('#root_addressLine2').clear();
      cy.get('#root_addressLine3').clear();

      cy.get('#root_city').select('FPO');

      cy.findByLabelText(/^State/).select('AE');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('09618');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', 'PSC 808 Box 37')
        .and('contain', 'FPO, Armed Forces Europe');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
