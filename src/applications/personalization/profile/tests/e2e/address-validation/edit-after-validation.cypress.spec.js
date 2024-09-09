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
      addressPage.validateSavedForm(formFields, false, 'Confirm your address');
      addressPage.editAddress(
        ['Street address (', 'Street address line 2'],
        [formFields.address, formFields.address2],
      );
      addressPage.validateSavedForm(formFields);
      cy.injectAxeThenAxeCheck();
    });
  });
});
