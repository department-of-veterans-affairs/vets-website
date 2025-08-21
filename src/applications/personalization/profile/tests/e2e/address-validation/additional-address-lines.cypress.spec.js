import AddressPage from './page-objects/AddressPage';

describe('Personal and contact information', () => {
  context('when entering info on line two', () => {
    it('show show the address validation screen', () => {
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
      addressPage.saveForm();
      addressPage.confirmAddress(formFields);
      cy.injectAxeThenAxeCheck();
    });
  });
});
