import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    skip: ['unauthenticated'], // Will remove when back end is set up
    dataPrefix: 'data',
    dataSets: ['unauthenticated'],
    fixtures: { data: path.join(__dirname, 'formDataSets') },
    pageHooks: {
      introduction: () => {
        cy.get('.schemaform-start-button').then(buttons => {
          buttons[0].click();
        });

        // Previous button click fully loads a new page, so we need to
        // re-inject aXe to get the automatic aXe checks working.
        cy.injectAxe();
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
