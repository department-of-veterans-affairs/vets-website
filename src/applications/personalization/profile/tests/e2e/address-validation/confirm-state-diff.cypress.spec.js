import { setUp } from 'applications/personalization/profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when user-input state does not match suggested address state', () => {
    it('should ask the user to confirm their address', () => {
      // This will return a single confirmed, high confidence address from the
      // validation API with a stateCode of 'CA'...
      setUp('valid-address');

      // ...so we'll set our address's state as 'CO'...
      cy.findByLabelText(/^State/).select('CO');

      cy.findByTestId('save-edit-button').click({
        force: true,
      });

      // ...and expect to be asked to confirm our address
      cy.findByTestId('mailingAddress').should(
        'contain',
        'Please confirm your address',
      );
    });
  });
});
