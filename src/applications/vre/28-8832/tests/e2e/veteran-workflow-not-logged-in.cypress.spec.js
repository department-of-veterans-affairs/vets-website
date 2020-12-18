import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    skip: ['veteran-workflow-test'], // Will remove when back end is set up
    dataPrefix: 'data',
    dataSets: ['veteran-workflow-test'],
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
          cy.get('.schemaform-start-button')
            .first()
            .click();
        });
      },
      'claimant-address': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('#root_claimantAddress_state').select('Alabama');
          cy.get('.usa-button-primary').click();
        });
      },
    },
    setupPerTest: () => {
      window.sessionStorage.removeItem('wizardStatus');
      cy.route('GET', '/v0/feature_toggles*', {
        data: {
          type: 'feature_toggles',
          features: [
            {
              name: 'show_chapter_36',
              value: true,
            },
          ],
        },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
