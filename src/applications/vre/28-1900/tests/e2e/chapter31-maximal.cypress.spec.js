import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    skip: ['chapter31-maximal'],
    dataPrefix: 'data',
    dataSets: ['chapter31-maximal'],
    fixtures: { data: path.join(__dirname, 'formDataSets') },
    setupPerTest: () => {
      window.sessionStorage.removeItem('wizardStatus31');
      cy.intercept('POST', '/v0/veteran_readiness_employment_claims', {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2020-11-12',
        attributes: {
          guid: '123fake-submission-id-567',
        },
      }).as('submitApplication');
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        // Previous button click fully loads a new page, so we need to
        // re-inject aXe to get the automatic aXe checks working.
        cy.get('#start-option-0').click();
        cy.get('#isVeteran-option-0').click();
        cy.get('#yesHonorableDischarge-option-0').click();
        cy.get('#yesHonorableDischarge-option-0').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.get('.usa-button-primary').click();
        cy.findAllByText(/Apply online with VA Form 28-1900/i, {
          selector: 'a',
        })
          .first()
          .click();
        cy.injectAxe();
        afterHook(() => {
          cy.get('.va-button-link.schemaform-start-button:first').click();
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
