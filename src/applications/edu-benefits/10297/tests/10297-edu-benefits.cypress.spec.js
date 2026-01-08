import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockUser from './fixtures/mocks/user.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import mockPrefillData from './fixtures/mocks/mockPrefillData.json';
import sip from './fixtures/mocks/sip-put.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      '/education/other-va-education-benefits/vet-tec-2/apply-for-program-form-22-10297/mailing-address': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.selectVaSelect('root_mailingAddress_country', 'USA');
          cy.fillVaTextInput('root_mailingAddress_street', 'The Street');
          cy.fillVaTextInput('root_mailingAddress_city', 'City');
          cy.selectVaSelect('root_mailingAddress_state', 'AL');
          cy.fillVaTextInput('root_mailingAddress_postalCode', '12345');
          cy.tabToSubmitForm();
        });
      },
      '/education/other-va-education-benefits/vet-tec-2/apply-for-program-form-22-10297/training-provider': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.selectVaRadioOption('root_view:summary', 'N');
          cy.tabToContinueForm();
        });
      },
      '/education/other-va-education-benefits/vet-tec-2/apply-for-program-form-22-10297/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('[id="checkbox-element"]').check({ force: true });
          cy.get('[id="inputField"]', { timeout: 10000 }).type('John Doe', {
            force: true,
          });
          // cy.get('[id="checkbox-element"]').check({ force: true });
          cy.tabToSubmitForm();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);

      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      cy.intercept('PUT', '/v0/in_progress_forms/22-10297', sip);
      cy.intercept('GET', '/v0/in_progress_forms/22-10297', mockPrefillData);

      cy.login(mockUser);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
