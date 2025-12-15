import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['maximal', 'minimal'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          // Click the start link to begin the form
          cy.get('va-link-action[data-testid="start-employment-info-link"]')
            .shadow()
            .find('a')
            .click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            // Use signature from test data - these are DIFFERENT from veteran names
            // to prove validation is disabled:
            // - maximal.json: "Test Signature Name" (veteran: "Boba J Fett")
            // - minimal.json: "Different Test Name" (veteran: "Ahsoka T Tano")
            const signature =
              data.statementOfTruthSignature || 'Test Signature';

            // Fill signature field
            cy.get('va-statement-of-truth')
              .shadow()
              .find('input[type="text"]')
              .type(signature);

            // Check the certification checkbox
            cy.get('va-statement-of-truth')
              .shadow()
              .find('input[type="checkbox"]')
              .check({ force: true });

            cy.axeCheck();

            // Submit the form
            cy.findByText(/submit/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      // Mock user and authentication
      cy.intercept('GET', '/v0/user', user);

      // Mock feature toggles
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles);

      // Mock save-in-progress endpoints
      cy.intercept('GET', '/v0/in_progress_forms/21-4192', {
        statusCode: 200,
        body: {
          formData: {},
          metadata: {},
        },
      });

      cy.intercept('PUT', '/v0/in_progress_forms/21-4192', {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              metadata: {
                version: 0,
                returnUrl: '/veteran-information',
              },
            },
          },
        },
      });

      // Mock form submission
      cy.intercept('POST', formConfig.submitUrl, {
        statusCode: 200,
        body: mockSubmit,
      });

      // Login
      cy.login(user);
    },
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
