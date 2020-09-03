import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['veteran-workflow-test'],
    fixtures: { data: path.join(__dirname, 'formDataSets') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('#claimant-relationship-0').click();
          cy.get('#disability-rating-1').click();
          cy.get('#vre-benefits-1').click();
          cy.get('#education-benefits-0').click();
          cy.get('#begin-form-now-0').click();
          cy.get('.va-button-primary').click();
          cy.get('.schemaform-start-button').click();
          cy.fillPage();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
