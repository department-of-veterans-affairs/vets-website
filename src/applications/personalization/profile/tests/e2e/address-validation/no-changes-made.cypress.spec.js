import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when updating their address without actually making a change', () => {
    it('should quickly exit edit view', () => {
      setUp('no-change');

      // hit save without making any changes on the form
      cy.findByRole('button', { name: /^update$/i }).should(
        'not.have.attr',
        'disabled',
      );
      cy.findByRole('button', { name: /^update$/i }).click({
        force: true,
      });

      // Use a short timeout to make sure that the edit view is exited quickly
      // and not just because the logic that auto-exits the edit view took
      // effect
      cy.findByRole('button', { name: /^update$/i, timeout: 10 }).should(
        'not.exist',
      );

      cy.findByTestId('mailingAddress').should('contain', '123 Test Street');

      cy.findByRole('button', { name: /edit mailing address/i }).should(
        'be.focused',
      );
    });
  });
});
