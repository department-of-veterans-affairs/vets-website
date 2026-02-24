import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import prefilledForm from '../fixtures/mocks/prefilled-form.json';
import sip from '../fixtures/mocks/sip-put.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['authenticated-test', 'unauthenticated-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(({ userLoggedIn }) => {
            // Grab corresponding start button/link based on authentication
            if (userLoggedIn) {
              cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
                .last()
                .click({ force: true });
            } else {
              cy.get('.schemaform-start-button')
                .first()
                .click();
            }
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(({ userLoggedIn }) => {
            if (userLoggedIn) {
              cy.get('#inputField').type('John Doe', { force: true });
            } else {
              cy.get('#inputField').type('Not Authenticated', { force: true });
            }
          });
          cy.get('#checkbox-element').check({ force: true });
          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },
    setupPerTest: () => {
      cy.get('@testData').then(({ userLoggedIn }) => {
        // Default endpoints to intercept
        cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
        cy.intercept('POST', formConfig.submitUrl, mockSubmit);
        cy.intercept('PUT', '/v0/in_progress_forms/22-10278', sip);

        // Tests the authenticated form path which requires login and prefill
        if (userLoggedIn) {
          cy.intercept('GET', '/v0/user', user);
          cy.intercept('GET', '/v0/in_progress_forms/22-10278', prefilledForm);
          cy.login(user);
        }
      });
    },
    skip: Cypress.env('CI'), // Skip CI initially until content-build is merged
  },
  manifest,
  formConfig,
);

testForm(testConfig);
