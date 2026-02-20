import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
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
      'claimant-contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { claimantContact } = data;
            if (claimantContact?.claimantPhoneNumber) {
              const countryCode =
                claimantContact.claimantPhoneNumber.countryCode || 'US';
              cy.get('va-combo-box')
                .shadow()
                .find('button.usa-combo-box__toggle-list')
                .click();

              cy.get(`li[data-value="${countryCode}"]`).click({ force: true });

              const phoneNumber =
                claimantContact.claimantPhoneNumber.contact || '';
              cy.get('input[type="tel"]').type(phoneNumber);

              if (claimantContact.claimantEmail) {
                cy.get('input[name="root_claimantContact_claimantEmail"]').type(
                  claimantContact.claimantEmail,
                );
              }
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'examiner-email': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const email =
              data.examinerNotification?.examinerEmail || 'doctor@example.com';
            cy.get(
              'input[name="root_examinerNotification_examinerEmail"]',
            ).type(email);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
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
      cy.intercept('GET', '/v0/in_progress_forms/21-2680-PRIMARY', {
        statusCode: 200,
        body: {
          formData: {},
          metadata: {},
        },
      });

      cy.intercept('PUT', '/v0/in_progress_forms/21-2680-PRIMARY', {
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
      cy.intercept('POST', formConfig.submitUrl, req => {
        req.reply({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            data: {
              id: '7',
              type: 'saved_claims',
              attributes: {
                submittedAt: '2025-11-24T04:36:36.556Z',
                regionalOffice: [
                  'Department of Veterans Affairs',
                  'Pension Management Center',
                  'P.O. Box 5365',
                  'Janesville, WI 53547-5365',
                ],
                confirmationNumber: 'a3e8be92-997e-43f7-ae55-34747947740d',
                guid: 'a3e8be92-997e-43f7-ae55-34747947740d',
                form: '21-2680',
              },
            },
          },
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
