import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import user from './user.json';
import mockDependents from './fixtures/mocks/mock-dependents.json';
import maximalTestData from './fixtures/data/maximal-test.json';

Cypress.config('waitForAnimations', true);

const FORM_ID = '21-0538';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['maximal-test'],

    setupPerTest: () => {
      cy.intercept('GET', '/v0/dependents_applications/show', mockDependents);
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [{ name: 'vaDependentsVerification', value: true }],
        },
      });
      cy.intercept('GET', '/v0/user', user);

      cy.intercept('GET', `/v0/in_progress_forms/${FORM_ID}`, {
        body: {
          formData: maximalTestData,
          metadata: {},
        },
      });

      cy.intercept('POST', '/dependents_verification/v0/claims', {
        statusCode: 200,
        body: {},
      });
      cy.login(user);
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.clickStartForm();
          cy.injectAxeThenAxeCheck();
        });
      },

      'veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.clickFormContinue();
          cy.injectAxeThenAxeCheck();
        });
      },

      // eslint-disable-next-line prettier/prettier
      'dependents': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-radio-option[value="Y"]').click();
          cy.clickFormContinue();
          cy.injectAxeThenAxeCheck();
        });
      },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input')
            .shadow()
            .find('input')
            .type('John Doe');

          cy.get('va-checkbox')
            .shadow()
            .find('input[type="checkbox"]')
            .check({ force: true });

          cy.clickFormContinue();
          cy.injectAxeThenAxeCheck();
        });
      },
    },

    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
