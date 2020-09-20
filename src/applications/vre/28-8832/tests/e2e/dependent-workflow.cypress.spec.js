import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    skip: ['dependent-workflow-test'], // Will remove when back end is set up
    dataPrefix: 'data',
    dataSets: ['dependent-workflow-test'],
    fixtures: { data: path.join(__dirname, 'formDataSets') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        cy.get('#claimant-relationship-0').click();
        cy.get('#vre-benefits-1').click();
        cy.get('#education-benefits-0').click();
        cy.get('#begin-form-now-0').click();
        cy.get('.va-button-primary').click();

        // Previous button click fully loads a new page, so we need to
        // re-inject aXe to get the automatic aXe checks working.
        cy.injectAxe();

        afterHook(() => {
          cy.get('.schemaform-start-button').click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
