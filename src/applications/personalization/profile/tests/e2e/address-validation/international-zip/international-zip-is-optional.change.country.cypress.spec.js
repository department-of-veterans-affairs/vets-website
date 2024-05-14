import { PROFILE_PATHS } from '@@profile/constants';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import finishedTransaction from '@@profile/tests/fixtures/transactions/finished-transaction.json';
import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import mockUser from './mocks/international-user.json';
import AddressPage from '../page-objects/AddressPage';
import { generateFeatureToggles } from '../../../../mocks/endpoints/feature-toggles';
import { createUserResponse } from '../user';
import { createAddressValidationResponse } from '../addressValidation';

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
      disableFTUXModals();

      cy.login(mockUser);
      cy.visit(PROFILE_PATHS.CONTACT_INFORMATION);
      cy.injectAxe();

      cy.findByRole('button', { name: /edit mailing address/i }).click({
        force: true,
      });
      cy.intercept('POST', '/v0/profile/address_validation', {
        statusCode: 200,
        body: createAddressValidationResponse('international'),
      });
      cy.intercept('PUT', '/v0/profile/addresses', {
        statusCode: 200,
        body: receivedTransaction,
      });

      cy.intercept(
        'GET',
        '/v0/profile/status/bfedd909-9dc4-4b27-abc2-a6cccaece35d',
        {
          statusCode: 200,
          body: finishedTransaction,
        },
      );

      cy.intercept('GET', '/v0/user?*', {
        statusCode: 200,
        body: createUserResponse('international'),
      });
    });
    it('should successfully update without zip', () => {
      const addressPage = new AddressPage();
      cy.injectAxeThenAxeCheck();
      cy.get('va-text-input[label^="International postal"][required="false"]');
      addressPage.fillAddressForm({
        country: 'USA',
      });
      cy.get('va-text-input[label="Zip code"][required="true"]');
      addressPage.fillAddressForm({
        country: 'NLD',
      });
      cy.get('va-text-input[label^="International postal"][required="false"]');
      const formFields = {
        country: 'NLD',
        address: 'Dam 1',
        city: 'Amsterdam',
      };
      addressPage.fillAddressForm(formFields);
      addressPage.saveForm();
      addressPage.validateSavedForm(formFields, true, null, [
        'Noord-Holland',
        'Netherlands',
      ]);
    });
  });
});
