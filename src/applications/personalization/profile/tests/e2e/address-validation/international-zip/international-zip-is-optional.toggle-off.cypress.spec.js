import AddressPage from '../page-objects/AddressPage';

import { generateFeatureToggles } from '../../../../mocks/feature-toggles';

describe('Personal and contact information', () => {
  describe('when entering an international address', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileEnhancements: false,
          profileDoNotRequireInternationalZipCode: false,
        }),
      );
    });

    it('should successfully update without zip', () => {
      const formFields = {
        country: 'NLD',
        address: 'Dam 1',
        city: 'Amsterdam',
      };

      const addressPage = new AddressPage();
      addressPage.loadPage('international');
      cy.injectAxeThenAxeCheck();
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      cy.get('#root_internationalPostalCode-error-message').should(
        'contain',
        'Postal code is required',
      );
    });
  });
});
