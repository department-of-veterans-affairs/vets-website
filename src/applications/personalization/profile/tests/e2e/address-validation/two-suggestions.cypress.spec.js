import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering a home address that has two suggestions', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        address: '575 20th',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '12345',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('two-suggestions');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.confirmAddress(formFields, ['575 20th Ave', '575 20th St']);
      addressPage.validateSavedForm({
        ...formFields,
        address: '575 20th St',
        zipCode: 94107,
      });
    });
  });
});
