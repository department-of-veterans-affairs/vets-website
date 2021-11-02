import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('should successfully update on Desktop', () => {
    describe('when entering a valid home address', () => {
      it('should update successfully without showing the validation screen', () => {
        const formFields = {
          address: '36320 Coronado Dr',
          city: 'Fremont',
          state: 'MD',
          zipCode: '94536',
        };
        const addressPage = new AddressPage();
        addressPage.loadPage('valid-address');
        addressPage.fillAddressForm(formFields);
        addressPage.saveForm();
        addressPage.validateSavedForm({ ...formFields, state: 'CA' });
      });
    });
  });
});
