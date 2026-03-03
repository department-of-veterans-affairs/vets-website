import AddressPage from './page-objects/AddressPage';

const ALERT_TEXT =
  'We’re sorry. We can’t update your information right now. We’re working to fix this problem. Try again later.';

// This test uses an empty response ({}) as a placeholder to simulate a system or network
// error response and verify that the vaps-service-error-alert is shown
describe('Personal and contact information', () => {
  describe('when the address validation api returns an empty response', () => {
    it('shows the vaps-service-error-alert', () => {
      const addressPage = new AddressPage();
      addressPage.loadPage();
      addressPage.fillAddressForm({
        address: '999 Unknown Ave',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62704',
      });
      addressPage.saveForm();

      cy.contains(ALERT_TEXT).should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });
});
