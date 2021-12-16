import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when getting a single suggestion with a confidence score <90', () => {
    it('should show the validation view and successfully update', () => {
      const formFields = {
        address: '36320 Coronado Dr',
        city: 'Fremont',
        state: 'CA',
        zipCode: '94530',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('low-confidence');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(formFields, false, null, [
        'Fremont, CA 94536',
      ]);
      addressPage.confirmAddress(formFields);
    });
  });
});
