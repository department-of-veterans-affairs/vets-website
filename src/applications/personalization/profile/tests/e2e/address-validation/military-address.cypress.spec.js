import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering a military address', () => {
    it('should successfully update on Desktop', () => {
      const formFields = {
        address: 'PSC 808 Box 37',
        state: 'AE',
        zipCode: '09618',
        military: true,
        postOffice: 'FPO',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('military');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
    });
  });
});
