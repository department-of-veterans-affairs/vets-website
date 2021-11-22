import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when user-input state does not match suggested address state', () => {
    it('should ask the user to confirm their address', () => {
      // This will return a single confirmed, high confidence address from the
      // validation API with a stateCode of 'CA'...
      const formFields = {
        address: '36320 Coronado Dr',
        address2: 'care of Care Taker',
        city: 'Fremont',
        state: 'CA',
        zipCode: '94536',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('valid-address');
      addressPage.fillAddressForm(formFields);
      // ...so we'll set our address's state as 'CO'...
      addressPage.fillAddressForm({ state: 'CO' });
      addressPage.saveForm();
      // ...and expect to be asked to confirm our address
      addressPage.confirmAddress(formFields);
    });
  });
});
