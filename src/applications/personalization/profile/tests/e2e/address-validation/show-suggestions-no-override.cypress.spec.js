import AddressPage from './page-objects/AddressPage';

const HEADLINE =
  'We can’t confirm the address you entered with the U.S. Postal Service';
const TEXT =
  'We can use the suggested address we found. Or, you can go back to edit the address you entered.';

describe('Personal and contact information', () => {
  describe('when there are confirmed suggestions and no validation key', () => {
    it('shows the SHOW_SUGGESTIONS_NO_OVERRIDE alert', () => {
      const addressPage = new AddressPage();
      addressPage.loadPage('show-suggestions-no-override', {
        profileShowNoValidationKeyAddressAlert: true,
      });
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
