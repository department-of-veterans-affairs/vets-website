import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status';
import manifest from '@bio-aquia/21-2680-house-bound-status/manifest.json';
import { featureToggles, user } from '../fixtures/mocks';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      'minimal',
      'maximal',
      'veteran-smp-hospitalized',
      'child-claimant-smc',
      'parent-claimant-smp-hospitalized',
    ],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          // Click the start link to begin the form
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { veteranFullName } = data.veteranInformation;
            // Build full name for signature (middle is optional, no suffix)
            // The platform displays the full name but validates flexibly
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
      cy.intercept('GET', '/v0/in_progress_forms/21-2680', {
        statusCode: 200,
        body: {
          formData: {},
          metadata: {},
        },
      });

      cy.intercept('PUT', '/v0/in_progress_forms/21-2680', {
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

      // Mock form submission - return a blob (PDF) response
      cy.intercept('POST', formConfig.submitUrl, req => {
        // Create a minimal PDF blob for testing
        const pdfContent = '%PDF-1.4\n%mock PDF content for testing';
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        req.reply({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="form-21-2680.pdf"',
          },
          body: blob,
        });
      });

      // Login
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
