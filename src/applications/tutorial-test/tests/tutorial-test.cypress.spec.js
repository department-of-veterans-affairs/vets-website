import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockUser from './fixtures/mocks/user.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      'name-and-date-of-birth': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.findByText('Continue', { selector: 'button' }).click();
        });
      },
      'identification-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_veteranId_ssn', '111-22-3333');
          cy.findByText('Continue', { selector: 'button' }).click();
        });
      },
      'mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaSelect('root_address_country', 'USA');
          cy.fillVaTextInput('root_address_street', '123 Main St');
          cy.fillVaTextInput('root_address_city', 'Nowhere');
          cy.selectVaSelect('root_address_state', 'OK');
          cy.fillVaTextInput('root_address_postalCode', '73038');
          cy.findByText('Continue', { selector: 'button' }).click();
        });
      },
      'phone-and-email-address': ({ afterHook }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_homePhone', '4058675309');
          cy.fillVaTextInput('root_emailAddress', 'johndoe@example.com');
          cy.findByText('Continue', { selector: 'button' }).click();
        });
      },
      // confirmation: ({ afterHook }) => {
      //   afterHook(() => {
      //     cy.findByText('Print this for your records', { selector: 'button' }).click();
      //   });
      // },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {});
      cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
      cy.intercept('PUT', '/v0/in_progress_forms/XX-230', {});
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
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
