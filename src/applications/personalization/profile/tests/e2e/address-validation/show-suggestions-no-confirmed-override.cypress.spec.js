import AddressPage from './page-objects/AddressPage';

const HEADLINE =
  'We can’t confirm the address you entered with the U.S. Postal Service.';
const TEXT =
  'Confirm that you want us to use this address as you entered it. Or, go back to edit it.';

describe('Personal and contact information', () => {
  describe('when the address validation api returns a single unconfirmed suggestion', () => {
    it('shows the SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE alert', () => {
      const addressPage = new AddressPage();
      addressPage.loadPage('show-suggestions-no-confirmed-override');
      addressPage.fillAddressForm({
        address: '999 Unknown Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
      });
      addressPage.saveForm();

      cy.contains(HEADLINE).should('be.visible');
      cy.contains(TEXT).should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });
});
