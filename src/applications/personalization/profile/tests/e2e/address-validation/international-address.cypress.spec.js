import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering an international address', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        country: 'NLD',
        address: 'Dam 1',
        city: 'Amsterdam',
        zipCodeInt: '1012 JS',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('international');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(formFields, true, null, [
        'Noord-Holland',
        'Netherlands',
      ]);
    });
  });
});
