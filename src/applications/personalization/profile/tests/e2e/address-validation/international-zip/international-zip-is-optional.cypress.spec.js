import AddressPage from '../page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering an international address', () => {
    it('should successfully update without zip', () => {
      const formFields = {
        country: 'NLD',
        address: 'Dam 1',
        city: 'Amsterdam',
      };

      const addressPage = new AddressPage();
      addressPage.loadPage('international');
      cy.injectAxeThenAxeCheck();
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(formFields, true, null, [
        'Noord-Holland',
        'Netherlands',
      ]);
    });
  });
});
