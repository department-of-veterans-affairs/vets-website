import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import set from 'lodash/set';
import AddressPage from '../page-objects/AddressPage';
import { generateFeatureToggles } from '../../../../mocks/endpoints/feature-toggles';

describe('Personal and contact information', () => {
  describe('when entering an international address', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        '/v0/feature_toggles*',
        generateFeatureToggles({
          profileEnhancements: false,
          profileDoNotRequireInternationalZipCode: true,
        }),
      );
    });
    it('should successfully update without zip', () => {
      cy.intercept('GET', '/v0/profile/status/*', req => {
        const id = req.url.split('/').pop();
        req.reply({
          statusCode: 200,
          body: set(
            finishedTransaction,
            'data.attributes.transactionId',
            `${id}`,
          ),
        });
      });

      const formFields = {
        country: 'NLD',
        address: 'Dam 1',
        city: 'Amsterdam',
      };

      const addressPage = new AddressPage();
      addressPage.loadPage('international');
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(formFields, true, null, [
        'Noord-Holland',
        'Netherlands',
      ]);
      cy.injectAxeThenAxeCheck();
    });
  });
});
