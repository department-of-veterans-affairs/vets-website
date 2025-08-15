import AddressPage from './page-objects/AddressPage';

const HEADLINE = 'We couldn’t verify your address';
const TEXT =
  'We can’t deliver your VA mail to this address because we can’t confirm it with the U.S. Postal Service. Try editing it.';

// Test succeeds when profileShowNoValidationKeyAddressAlert flag is off
describe('Personal and contact information', () => {
  describe('when the address validation api returns a validation error', () => {
    it('shows the validation error alert', () => {
      const addressPage = new AddressPage();
      addressPage.loadPage('validation-error');
      addressPage.fillAddressForm({
        address: '123 Fake St',
        city: 'Nowhere',
        state: 'AZ',
        zipCode: '00000',
      });
      addressPage.saveForm();

      cy.contains(HEADLINE).should('be.visible');
      cy.contains(TEXT).should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });
});
