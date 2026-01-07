// Test file for form 21p-0537 (Marital Status Questionnaire for DIC Recipients)

import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  fillVeteranName,
  fillVeteranIdentifier,
  fillRemarriageStatus,
  fillMarriageInfo,
  fillSpouseVeteranStatus,
  fillSpouseVeteranId,
  fillTerminationStatus,
  fillTerminationDetails,
  fillContactInfo,
} from './e2e/utils/fillers';

import {
  goToNextPage,
  startAsAuthUser,
  completeReviewAndSubmit,
  checkAccessibility,
} from './e2e/utils/helpers';

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
          startAsAuthUser();
        });
      },
      'veteran-name': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillVeteranName(data);
            goToNextPage();
          });
        });
      },

      'veteran-identifier': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillVeteranIdentifier(data);
            goToNextPage();
          });
        });
      },

      'remarriage-status': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillRemarriageStatus(data);
            goToNextPage();
          });
        });
      },

      'marriage-info': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillMarriageInfo(data);
            goToNextPage();
          });
        });
      },

      'spouse-veteran-status': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillSpouseVeteranStatus(data);
            goToNextPage();
          });
        });
      },

      'spouse-veteran-id': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillSpouseVeteranId(data);
            goToNextPage();
          });
        });
      },

      'remarriage-end-status': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillTerminationStatus(data);
            goToNextPage();
          });
        });
      },

      'remarriage-end-details': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillTerminationDetails(data);
            goToNextPage();
          });
        });
      },

      'contact-info': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            checkAccessibility();
            fillContactInfo(data);
            goToNextPage();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            completeReviewAndSubmit(data);
          });
        });
      },
    },
    setupPerTest: () => {
      setupForAuth();
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
