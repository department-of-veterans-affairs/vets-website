import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';
import { featureToggles, user } from './fixtures/mocks';

// Helper for date component fillings
export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');

    if (navigator.userAgent.includes('Chrome')) {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .as('field');

      cy.get('@field').select(parseInt(month, 10));
      cy.get('@field').realPress('Tab');
      cy.get('@field').realType(day);
      cy.get('@field').realPress('Tab');
      cy.get('@field').realType(year);
    } else {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .as('month');
      cy.get('@month').select(parseInt(month, 10));
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-text-input.usa-form-group--day-input')
        .shadow()
        .find('input')
        .as('day');
      cy.get('@day').type(day);
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-text-input.usa-form-group--year-input')
        .shadow()
        .find('input')
        .as('year');
      cy.get('@year').type(year);
    }
  }
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal', 'maximal'],
    // Slow down test execution for debugging (in milliseconds)
    // Comment out or remove this line for normal speed
    // slowTestThreshold: 1000,
    setupPerTest: () => {
      // Mock user and authentication
      cy.intercept('GET', '/v0/user', user);

      // Mock feature toggles
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles);

      // Mock form submission
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });

      // Mock save-in-progress endpoints
      cy.intercept('PUT', '/v0/in_progress_forms/21P-530A', {
        statusCode: 200,
        body: {
          formId: '21P-530A',
          createdAt: '2025-01-15T14:30:00.000Z',
          updatedAt: '2025-01-15T14:30:00.000Z',
        },
      });
      cy.intercept('GET', '/v0/in_progress_forms/21P-530A', {
        statusCode: 200,
        body: {
          formId: '21P-530A',
          createdAt: '2025-01-15T14:30:00.000Z',
          updatedAt: '2025-01-15T14:30:00.000Z',
        },
      });

      // Login
      cy.login(user);
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // VaLinkAction
          cy.get('[data-testid="start-burial-allowance-link"]');
          cy.get('[data-testid="start-burial-allowance-link"]').click();
        });
      },
      // Not sure why the date page wasn't playing nice.
      'service-periods/:index/dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { dateEnteredService, dateLeftService } = data.periods[0];
            if (dateEnteredService) {
              fillDateWebComponentPattern(
                'dateEnteredService',
                dateEnteredService,
              );
            }
            if (dateLeftService) {
              fillDateWebComponentPattern('dateLeftService', dateLeftService);
            }
            cy.clickFormContinue();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            // Use organization names from form data for signature validation
            const recipientOrgName =
              data?.burialInformation?.recipientOrganization?.name || '';
            const stateTribalOrgName =
              data?.burialInformation
                ?.nameOfStateCemeteryOrTribalOrganization || '';

            // Fill organization title (must match state/tribal organization name)
            cy.get('va-text-input[name="organizationTitle"]')
              .shadow()
              .find('input')
              .as('orgTitle');
            cy.get('@orgTitle').type(stateTribalOrgName);

            // Fill full name signature (must match recipient organization name)
            cy.get('#veteran-signature')
              .shadow()
              .find('input')
              .first()
              .as('signature');
            cy.get('@signature').type(recipientOrgName);

            // Check certification checkbox
            cy.get(`va-statement-of-truth`)
              .shadow()
              .find('va-checkbox')
              .shadow()
              .find('input')
              .as('checkbox');
            cy.get('@checkbox').check({ force: true });

            cy.clickFormContinue();
          });
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
