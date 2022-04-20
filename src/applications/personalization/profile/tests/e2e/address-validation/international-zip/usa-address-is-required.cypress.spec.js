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
      cy.findByLabelText(/Zip code/i).clear();
      addressPage.saveForm();
      cy.get('#root_zipCode-error-message').should(
        'contain',
        'Zip code is required',
      );
    });
  });
});
