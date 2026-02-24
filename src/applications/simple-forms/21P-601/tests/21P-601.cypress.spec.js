// Test file for form 21P-601 (Application for Accrued Amounts Due a Deceased Beneficiary)

import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillDateWebComponentPattern,
  fillTextAreaWebComponent,
} from '../../shared/tests/e2e/helpers';

import formConfig from '../config/form';
import manifest from '../manifest.json';

// Mock data
import mockUser from './e2e/fixtures/mocks/user.json';
import mockSipGet from './e2e/fixtures/mocks/sip-get.json';
import mockSipPut from './e2e/fixtures/mocks/sip-put.json';
import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
    dataSets: [
      'minimal-test',
      'test-beneficiary-not-veteran',
      'test-data-child',
      'test-data-creditor',
      'test-data-executor',
      'test-data-parent',
      'test-data-spouse',
    ],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.clickStartForm();
        });
      },

      'beneficiary-date-of-death': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillDateWebComponentPattern(
              'beneficiaryDateOfDeath',
              data.beneficiaryDateOfDeath,
            );
            cy.get('va-button[text*="continue" i]').click();
          });
        });
      },

      'additional-info/remarks': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.remarks) {
              fillTextAreaWebComponent('remarks', data.remarks);
            }
            // cy.axeCheck();
            cy.get('va-button[text*="continue" i]').click();
          });
        });
      },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillVaStatementOfTruth({
              fullName: Object.values(data.claimantFullName).join(' '),
              checked: true,
            });
            cy.get('va-button[text*="submit" i]').click();
          });
        });
      },
    },
    setupPerTest: () => {
      // Mock API endpoints
      cy.intercept('GET', '/v0/feature_toggles*', mockFeatureToggles);

      // Mock the form submission endpoint
      cy.intercept('POST', formConfig.submitUrl, req => {
        // Mock successful response
        req.reply({ status: 200 });
      });

      // Mock save in progress endpoints
      cy.intercept('GET', '/v0/in_progress_forms/21P-601', mockSipGet);
      cy.intercept('PUT', '/v0/in_progress_forms/21P-601', mockSipPut);

      // Include shadow DOM in commands
      cy.config('includeShadowDom', true);
      cy.config('retries', { runMode: 0 });

      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
