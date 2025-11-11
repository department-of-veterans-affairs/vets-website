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
    dataSets: [
      'minimal-test',
      'maximal-test',
      'currently-employed-test',
      'duty-status-only-test',
    ],
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
            const { veteranFullName } = data.veteranInformation;
            const veteranName = [
              veteranFullName.first,
              veteranFullName.middle,
              veteranFullName.last,
            ]
              .filter(Boolean)
              .join(' ');

            // Fill signature field within VaStatementOfTruth component
            cy.get('va-statement-of-truth')
              .shadow()
              .find('input[type="text"]')
              .type(veteranName);

            // Check statement of truth checkbox within VaStatementOfTruth component
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
