import mockProfileShowAddressChangeModalToggle from '@@profile/tests/fixtures/contact-information-feature-toggles.json';
import { setupHomeAddressModalCheck } from './setup';
import AddressPage from '../address-validation/page-objects/AddressPage';
import user36 from '../../fixtures/users/user-36.json';

describe('Home address update modal', () => {
  describe('when addresses DO match', () => {
    it('should NOT SHOW update prompt modal', () => {
      const formFields = {
        address: '36320 Coronado Dr',
        city: 'Fremont',
        state: 'MD',
        zipCode: '94536',
      };
      cy.intercept(
        'v0/feature_toggles*',
        mockProfileShowAddressChangeModalToggle,
      );

      setupHomeAddressModalCheck('valid-address');

      const addressPage = new AddressPage();
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();

      cy.findByTestId('modal-content').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should SHOW update prompt modal', () => {
      const formFields = {
        address: '36320 Coronado Dr',
        city: 'Fremont',
        state: 'MD',
        zipCode: '94536',
      };
      cy.intercept(
        'v0/feature_toggles*',
        mockProfileShowAddressChangeModalToggle,
      );

      setupHomeAddressModalCheck('valid-address');

      const addressPage = new AddressPage();

      cy.intercept('GET', '/v0/user?*', {
        statusCode: 200,
        body: user36,
      });

      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();

      cy.findByTestId('modal-content').should('not.exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
