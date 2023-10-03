import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering a home address with a missing unit', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        address: '225 irving st',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94122',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('missing-unit');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.confirmAddress(formFields, [], true, true);
      addressPage.validateSavedForm(formFields);
      cy.injectAxeThenAxeCheck();
    });
  });
});
