import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when entering an international address', () => {
    it('should successfully update on Desktop', () => {
      setUp('international');

      cy.findByLabelText(/Country/i).select('NLD');

      cy.get('#root_addressLine1')
        .clear()
        .type('Dam 1');
      cy.get('#root_addressLine2').clear();
      cy.get('#root_addressLine3').clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('Amsterdam');
      cy.findByLabelText(/International postal code/i)
        .clear()
        .type('1012 JS');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', 'Dam 1')
        .and('contain', 'Amsterdam, Noord-Holland, 1012 JS')
        .and('contain', 'Netherlands');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
