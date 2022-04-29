import { PROFILE_PATHS } from '@@profile/constants';
import receivedTransaction from '@@profile/tests/fixtures/transactions/received-transaction.json';
import mockUser from './mocks/international-user.json';
import AddressPage from '../page-objects/AddressPage';
import { generateFeatureToggles } from '../../../../mocks/feature-toggles';
import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';
import { createUserResponse } from '../user';

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
      cy.visit(PROFILE_PATHS.PERSONAL_INFORMATION);
      cy.injectAxe();

      cy.findByRole('button', { name: /edit mailing address/i }).click({
        force: true,
      });

      cy.intercept('PUT', '/v0/profile/addresses', {
        statusCode: 200,
        body: receivedTransaction,
      });

      cy.intercept('GET', '/v0/user?*', {
        statusCode: 200,
        body: createUserResponse('international'),
      });
    });
    it('should successfully update without zip', () => {
      const addressPage = new AddressPage();
      cy.injectAxeThenAxeCheck();
      cy.get(
        '#root_internationalPostalCode-label > .schemaform-required-span',
      ).should('not.exist');
      addressPage.fillAddressForm({
        country: 'USA',
      });
      cy.get('#root_zipCode-label > .schemaform-required-span').should('exist');
      addressPage.fillAddressForm({
        country: 'NLD',
      });
      cy.get(
        '#root_internationalPostalCode-label > .schemaform-required-span',
      ).should('not.exist');
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
