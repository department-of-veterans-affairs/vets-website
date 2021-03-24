import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when returning to the address edit form from the validation screen', () => {
    it('should prefill the address edit form with the address they had just entered, _not_ the address currently on file', () => {
      const addressLine1 = '225 irving st';
      const addressLine2 = 'Unit A';

      setUp('bad-unit');
      cy.axeCheck();

      cy.findByRole('button', { name: /^Update$/i }).should(
        'not.have.attr',
        'disabled',
      );

      cy.findByLabelText(/^Street address/i)
        .clear()
        .type(addressLine1);
      cy.findAllByLabelText(/^Line 2/i)
        .clear()
        .type(addressLine2);
      cy.findAllByLabelText(/^Line 3/i).clear();

      cy.findByLabelText(/City/i)
        .clear()
        .type('San Francisco');
      cy.findByLabelText(/^State/).select('CA');
      cy.findByLabelText(/Zip code/i)
        .clear()
        .type('94122');

      cy.axeCheck();

      cy.findByRole('button', { name: /^Update$/i }).click({ force: true });

      cy.axeCheck();

      cy.findByText('Please update or confirm your unit number').should(
        'exist',
      );

      cy.findByTestId('mailingAddress').should(
        'contain',
        `${addressLine1}, ${addressLine2}`,
      );

      // click the edit address button to return to the edit view
      cy.findByRole('button', { name: /edit your address/i }).click();

      // confirm the address we just entered is in the form
      cy.findByLabelText(/^street address/i).should('have.value', addressLine1);
      cy.findAllByLabelText(/^Line 2/i).should('have.value', addressLine2);

      // then click the update button to return to the validation screen
      cy.findByRole('button', { name: /^Update$/i }).click({ force: true });

      cy.findByRole('button', { name: /^use this address$/i }).click({
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
