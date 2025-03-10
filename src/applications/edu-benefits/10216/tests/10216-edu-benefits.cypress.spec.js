import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';

const mockManifest = {
  appName: '35% exemption of the routine reporting',
  entryFile: './app-entry.jsx',
  entryName: '10216-edu-benefits',
  productId: 'db0db964-89ef-4e80-a469-499b7db330cd',
  rootUrl:
    '/education/apply-for-education-benefits/application/10216/institution-details',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['maximal-test.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('[class="schemaform-start-button"]')
            .first()
            .click();
        });
      },
      // 'review-and-submit': ({ afterHook }) => {
      //   afterHook(() => {
      //     // cy.get('@testKey').then(testKey => {
      //     cy.get('[id="inputField"]', { timeout: 10000 }).type('John Doe', {
      //       force: true,
      //     });
      //     cy.get('[id="checkbox-element"]').check({ force: true });

      //     // cy.findAllByText(/submit/i, { selector: 'button' })
      //     //   .first()
      //     //   .click();
      //   });
      // },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testKey').then(testKey => {
            if (testKey === 'maximal-test.json') {
              cy.get('va-text-input')
                .shadow()
                .find('input')
                .type('Jane Test Doe');
            } else {
              cy.get('va-text-input')
                .shadow()
                .find('input')
                .type('Jane Doe');
            }
          });

          cy.get(`va-checkbox`)
            .shadow()
            .find('input')
            .check({ force: true });

          cy.findAllByText(/submit/i, { selector: 'button' })
            .first()
            .click();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl);
    },
    // skip: Cypress.env('CI'),
  },
  mockManifest,
  formConfig,
);

testForm(testConfig);
