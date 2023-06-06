import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering an address with a bad unit', () => {
    it('should successfully update on Desktop', () => {
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
      addressPage.saveForm(true);
      addressPage.confirmAddress(formFields, [], true);
      cy.injectAxeThenAxeCheck();
    });
  });
});
