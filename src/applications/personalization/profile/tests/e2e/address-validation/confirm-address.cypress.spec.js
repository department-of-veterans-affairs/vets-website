import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering a valid address that needs confirmation', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        address: '36310 Coronado Dr',
        city: 'Fremont',
        state: 'CA',
        zipCode: '94536',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('confirm-address');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.confirmAddress(formFields);
      addressPage.validateSavedForm(formFields);
      cy.injectAxeThenAxeCheck();
    });
  });
});
