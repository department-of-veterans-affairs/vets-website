import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering a home address that has one suggestion', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        address: '400 65th st',
        city: 'Seattle',
        state: 'WA',
        zipCode: '12345',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('one-suggestion');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.confirmAddress(formFields, ['400 NW 65th St']);
      addressPage.validateSavedForm({
        ...formFields,
        address: '400 NW 65th St',
        zipCode: 12345,
      });
    });
  });
});
