import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockSubmit from './fixtures/data/mocks/application-submit.json';

import formConfig from '../config/form';

const mockManifest = {
  appName: '35% exemption of the routine reporting',
  entryFile: './app-entry.jsx',
  entryName: '10216-edu-benefits',
  productId: 'db0db964-89ef-4e80-a469-499b7db330cd',
  rootUrl:
    '/education/apply-for-education-benefits/application/10216/institution-details/',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['maximal-test.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('a.va-link--primary')
            .first()
            .click();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: Cypress.env('CI'),
  },
  mockManifest,
  formConfig,
);

testForm(testConfig);
