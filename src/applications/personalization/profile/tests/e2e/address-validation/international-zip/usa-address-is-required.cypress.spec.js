import AddressPage from '../page-objects/AddressPage';

describe('Personal and contact information', () => {
  describe('when entering an U.S. address', () => {
    it('should required a zip', () => {
      const formFields = {
        address: '36320 Coronado Dr',
        address2: 'care of Care Taker',
        city: 'Fremont',
        state: 'CA',
      };
      const addressPage = new AddressPage();
      addressPage.loadPage('missing-zip');
      cy.injectAxeThenAxeCheck();
      addressPage.fillAddressForm(formFields);
      // clear zip code
      cy.get('va-text-input[label="Zip code"]')
        .shadow()
        .find('input')
        .clear();
      addressPage.saveForm();
      cy.get('va-text-input[label="Zip code"][error="Zip code is required"]');
    });
  });
});
