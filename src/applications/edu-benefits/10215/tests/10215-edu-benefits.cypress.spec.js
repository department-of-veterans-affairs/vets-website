import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';
import manifest from '../manifest.json';

import formConfig from '../config/form';

const mockManifest = {
  appName: manifest.appName,
  entryFile: manifest.entryFile,
  entryName: manifest.entryName,
  productId: manifest.productId,
  rootUrl: manifest.rootUrl,
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['maximal-test', 'test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // cy.get('a.va-link--primary')
          cy.get('[class="schemaform-start-button"]')
            .first()
            .click();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/85-15-calculations/summary': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.selectVaRadioOption('root_view:programsSummary', 'N');
          cy.tabToContinueForm();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          // cy.get('@testKey').then(testKey => {
          cy.get('[id="inputField"]', { timeout: 10000 }).type('John Doe', {
            force: true,
          });
          cy.get('[id="checkbox-element"]').check({ force: true });
          cy.tabToSubmitForm();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl);
    },
    skip: Cypress.env('CI'),
  },
  mockManifest,
  formConfig,
);

testForm(testConfig);
