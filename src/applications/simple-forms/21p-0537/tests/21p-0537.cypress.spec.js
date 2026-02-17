// Test file for form 21p-0537 (Marital Status Questionnaire for DIC Recipients)

import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import { fillMarriageInfo, fillTerminationDetails } from './e2e/utils/fillers';

import { goToNextPage } from './e2e/utils/helpers';

import { setupForAuth } from './e2e/utils/setup';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures'),
    dataSets: [
      'test-data-complete',
      'test-data-not-remarried',
      'test-data-over-57',
      'test-data-terminated',
      'test-data-va-file-only',
      'test-data',
    ],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.clickStartForm();
        });
      },
      'marriage-info': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.injectAxeThenAxeCheck();
            fillMarriageInfo(data);
            goToNextPage();
          });
        });
      },

      'remarriage-end-details': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.injectAxeThenAxeCheck();
            fillTerminationDetails(data);
            goToNextPage();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillVaStatementOfTruth({
              fullName: data.signature,
              checked: true,
            });
            cy.get('va-button[text*="submit" i]').click();
          });
        });
      },
    },
    setupPerTest: () => {
      setupForAuth();
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
