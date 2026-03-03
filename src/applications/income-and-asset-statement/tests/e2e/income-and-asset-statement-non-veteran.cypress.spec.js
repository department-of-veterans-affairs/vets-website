import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import { fillDateWebComponentPattern } from './helpers';

import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

const SUBMISSION_DATE = new Date().toISOString();
const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: '21P-0969 Income and Asset Statement Form',
    dataPrefix: 'data',
    dataSets: ['test-data'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.clickStartForm();
        });
      },
      'claimant/reporting-period': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { incomeNetWorthDateRange } = data;
            fillDateWebComponentPattern(
              'incomeNetWorthDateRange_from',
              incomeNetWorthDateRange.from,
            );
            fillDateWebComponentPattern(
              'incomeNetWorthDateRange_to',
              incomeNetWorthDateRange.to,
            );
            cy.clickFormContinue();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('#veteran-signature')
              .shadow()
              .find('input')
              .first()
              .type(data.statementOfTruthSignature);
            cy.get(`#veteran-certify`)
              .first()
              .shadow()
              .find('input')
              .click({ force: true });
            cy.clickFormContinue(); // Submit
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          features: [
            {
              name: 'income_and_assets_form_enabled',
              value: true,
            },
            {
              name: 'income_and_assets_browser_monitoring_enabled',
              value: true,
            },
            {
              name: 'income_and_assets_content_updates',
              value: false,
            },
          ],
        },
      });
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('GET', '/v0/maintenance_windows*', 'OK');
      cy.intercept('GET', '/v0/maintenance_windows', { data: [] });
      cy.intercept('PUT', '/v0/in_progress_forms/21P-0969', {
        data: {
          id: '1234',
          type: 'in_progress_forms',
          attributes: {
            formId: '21P-0969',
            createdAt: '2021-06-03T00:00:00.000Z',
            updatedAt: '2021-06-03T00:00:00.000Z',
            metadata: {
              version: 1,
              returnUrl: '',
              savedAt: 1593500000000,
              lastUpdated: 1593500000000,
              expiresAt: 99999999999,
            },
          },
        },
      });
      cy.intercept('POST', `income_and_assets/v0/${formConfig.submitUrl}`, {
        data: {
          id: 'mock-id',
          type: 'saved_income_and_asset_claim',
          attributes: {
            submittedAt: SUBMISSION_DATE,
            regionalOffice: [
              'Attention:  Philadelphia Pension Center',
              'P.O. Box 5206',
              'Janesville, WI 53547-5206',
            ],
            confirmationNumber: SUBMISSION_CONFIRMATION_NUMBER,
            guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
            form: '21P-0969',
          },
        },
      }).as('submitApplication');

      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
