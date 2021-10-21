import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when returning to the address edit form from the validation screen', () => {
    it('should prefill the address edit form with the address they had just entered, _not_ the address currently on file', () => {
      const formFields = {
        address: '225 irving st',
        address2: 'Unit A',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94122',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('bad-unit');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(
        formFields,
        false,
        'Please update or confirm your unit number',
      );

      cy.findByTestId('mailingAddress').should(
        'contain',
        `${formFields.address}, ${formFields.address2}`,
      );

      // click the edit address button to return to the edit view
      cy.findByRole('button', { name: /edit your address/i }).click();

      // confirm the address we just entered is in the form
      cy.findByLabelText(/^street address \(/i).should(
        'have.value',
        formFields.address,
      );
      cy.findAllByLabelText(/^street address line 2/i).should(
        'have.value',
        formFields.address2,
      );

      // then click the update button to return to the validation screen
      cy.findByRole('button', { name: /^Update$/i }).click({ force: true });

      cy.findByRole('button', { name: /^use this address$/i }).click({
        force: true,
      });

      cy.findByTestId('mailingAddress')
        .should('contain', '225 irving st, Unit A')
        .and('contain', 'San Francisco, CA 94122');

      cy.focused()
        .invoke('text')
        .should('match', /update saved/i);
    });
  });
});
