import path from 'path';
import mockUser from '../fixtures/test-user.json';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { WIZARD_STATUS } from 'applications/vre/28-1900/constants';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    skip: ['authenticated'], // Will remove when back end is set up
    dataPrefix: 'data',
    dataSets: ['authenticated'],
    fixtures: { data: path.join(__dirname, 'formDataSets') },
    setupPerTest: () => {
      window.sessionStorage.removeItem(WIZARD_STATUS);
      cy.login(mockUser);
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        // Previous button click fully loads a new page, so we need to
        // re-inject aXe to get the automatic aXe checks working.
        cy.get('#start-option-0').click();
        cy.get('#isVeteran-option-0').click();
        cy.get('#yesHonorableDischarge-option-0').click();
        cy.get('#disabilityRating-option-0').click();
        cy.get('#yesActiveDutySeparation-option-0').click();
        cy.get('.usa-button-primary.va-button-primary').click();
        cy.injectAxe();

        afterHook(() => {
          cy.get(
            '.usa-button-primary.va-button-primary.schemaform-start-button:first',
          ).click();
        });
      },
      'veteran-contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          // need to manually fill this in because state is initialized as a text input instead of a select tag
          cy.get('#root_veteranAddress_state').select('Alabama');
          cy.get('.usa-button-primary').click();
        });
      },
      'additional-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          // need to manually fill this in because state is initialized as a text input instead of a select tag
          cy.get('#root_newAddress_state').select('Alabama');
          cy.get('.usa-button-primary').click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
