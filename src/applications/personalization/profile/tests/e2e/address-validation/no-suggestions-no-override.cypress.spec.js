import AddressPage from './page-objects/AddressPage';

const HEADLINE = 'This address you entered is invalid';
const TEXT =
  'We can’t confirm the address you entered with the U.S. Postal Service. You’ll need to go back to edit it.';

describe('Personal and contact information', () => {
  describe('when there are no suggestions and no validation key', () => {
    it('shows the NO_SUGGESTIONS_NO_OVERRIDE alert', () => {
      const addressPage = new AddressPage();
      addressPage.loadPage('no-suggestions-no-override');
      addressPage.fillAddressForm({
        address: '999 Nowhere Rd',
        city: 'Nowhere',
        state: 'IL',
        zipCode: '00000',
      });
      addressPage.saveForm();

      cy.contains(HEADLINE).should('be.visible');
      cy.contains(TEXT).should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });
});
