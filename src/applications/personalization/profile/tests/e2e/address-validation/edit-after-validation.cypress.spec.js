import { setUp } from '@@profile/tests/e2e/address-validation/setup';

describe('Personal and contact information', () => {
  describe('when returning to the address edit form from the validation screen', () => {
    it('should prefill the address edit form with the address they have just entered, not the address currently on file', () => {
      const addressLine1 = '225 irving st';
      const addressLine2 = 'Unit A';

      setUp('bad-unit');
      cy.axeCheck();

      cy.findByRole('button', { name: /^Update$/i }).should(
        'have.attr',
        'disabled',
      );

      cy.findAllByLabelText(/street address/i)
        .first()
        .clear()
        .type(addressLine1);
      cy.findAllByLabelText(/street address/i)
        .its('1')
        .clear()
        .type(addressLine2);
      cy.findAllByLabelText(/street address/i)
        .its('2')
        .clear();

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
      cy.findAllByLabelText(/street address/i)
        .first()
        .should('have.value', addressLine1);
      cy.findAllByLabelText(/street address/i)
        .its('1')
        .should('have.value', addressLine2);

      // The following steps have been commented out due to a bug that
      // disables the SAVE button if the current form data matches the
      // prefilled form data. This logic should be updated to disable the SAVE
      // button if the current form data matches the data that is currently on
      // file for the user
      // Bug ticket: https://github.com/department-of-veterans-affairs/va.gov-team/issues/20494

      // then click the save button to return to the validation screen
      // cy.findByRole('button', { name: /^Update$/i }).click({ force: true });

      // cy.findByRole('button', { name: /^use this address$/i }).click({
      //   force: true,
      // });

      // cy.findByTestId('mailingAddress')
      //   .should('contain', '225 irving st, Unit A')
      //   .and('contain', 'San Francisco, CA 94122');

      // cy.findByRole('button', { name: /edit mailing address/i }).should(
      //   'be.focused',
      // );
    });
  });
});
