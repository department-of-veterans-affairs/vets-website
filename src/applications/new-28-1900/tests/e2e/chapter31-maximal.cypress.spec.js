import path from 'path';

import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { CHAPTER_31_ROOT_URL, WIZARD_STATUS } from '../../constants';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['chapter31-maximal'],
    fixtures: { data: path.join(__dirname, 'formDataSets') },
    setupPerTest: () => {
      window.sessionStorage.removeItem(WIZARD_STATUS);
      window.sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login();
      cy.visit(CHAPTER_31_ROOT_URL);
      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/28-1900', testData);
        cy.intercept('PUT', '/v0/in_progress_forms/28-1900', testData);
      });
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
        afterHook(() => {
          cy.injectAxe();
          cy.get('.vads-c-action-link--green')
            .first()
            .click();
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
