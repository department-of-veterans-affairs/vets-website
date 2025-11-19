import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockVaFileNumber from './fixtures/va-file-number.json';
import mockDependents from './fixtures/mock-dependents.json';
import user from './user.json';
import {
  fillDateWebComponentPattern,
  fillStandardTextInput,
  fillSelectWebComponent,
  selectRadioWebComponent,
  signAndSubmit,
} from './cypress.helpers';

Cypress.config('waitForAnimations', true);

/**
 * Helper to select checkboxes in the V3 picklist
 * @param {string} key - The dependent key (e.g., 'spousy-3332')
 */
const selectPicklistDependent = key => {
  cy.get(`va-checkbox[data-key="${key}"]`)
        .shadow()
        .find('label')
        .click({ force: true });
};

/**
 * Helper to click continue on picklist page and navigate to followup
 */
const continueFromPicklist = () => {
  cy.clickFormContinue();
};

/**
 * Helper to get the current dependent from picklist based on URL index param
 * @param {Object} data - The test data
 * @param {Function} callback - Callback function with dependent data
 */
const getCurrentDependent = (data, callback) => {
  const picklistData = data['view:removeDependentPickList'] || [];

  cy.url().then(url => {
    const urlObj = new URL(url);
    const index = parseInt(urlObj.searchParams.get('index'), 10);
    const dependent = picklistData[index];
    callback(dependent);
  });
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['removal-only-v3'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      cy.login(user);

      // Enable V3 feature toggle along with existing V2 toggles
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'vaDependentsV2', value: true },
            { name: 'va_dependents_v2', value: true },
            { name: 'vaDependentsV3', value: true },
            { name: 'va_dependents_v3', value: true },
            { name: 'vaDependentsNetWorthAndPension', value: false },
            { name: 'va_dependents_net_worth_and_pension', value: false },
          ],
        },
      });

      cy.intercept(
        'GET',
        '/v0/profile/valid_va_file_number',
        mockVaFileNumber,
      ).as('mockVaFileNumber');

      cy.intercept('POST', '/v0/claim_attachments', {
        data: {
          attributes: {
            confirmationCode: '5',
          },
        },
      });

      cy.get('@testData').then(testData => {
        // Mock dependents API endpoints for picklist data
        cy.intercept('GET', '/v0/dependents', {
          data: testData.dependents,
        }).as('mockDependents');

        // Mock dependents_applications/show endpoint to prevent "Unknown error"
        cy.intercept('GET', '/v0/dependents_applications/show', mockDependents).as(
          'mockDependentsShow',
        );

        // In-progress form GET must return formData and metadata structure
        cy.intercept('GET', '/v0/in_progress_forms/686C-674-V2', {
          formData: testData,
          metadata: {
            version: 0,
            prefill: false,
            returnUrl: '/review-and-submit',
          },
        });

        // In-progress form PUT response
        cy.intercept('PUT', 'v0/in_progress_forms/686C-674-V2', {
          data: {
            id: '1234',
            type: 'in_progress_forms',
            attributes: {
              formId: '686C-674-V2',
              createdAt: '2021-06-03T00:00:00.000Z',
              updatedAt: '2021-06-03T00:00:00.000Z',
              metadata: {
                version: 1,
                returnUrl: '/review-and-submit',
                savedAt: Date.now(),
                lastUpdated: Date.now(),
                expiresAt: 99999999999,
              },
            },
          },
        });
      });

      cy.intercept('POST', '/v0/dependents_applications', {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2020-11-12',
        attributes: {
          guid: '123fake-submission-id-567',
        },
      }).as('submitApplication');
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.wait('@mockVaFileNumber');
          cy.clickStartForm();
        });
      },

      // V3 Picklist selection page
      'options-selection/remove-active-dependents': ({ beforeHook, afterHook }) => {
        afterHook(() => {
          // Only select 1 parent, 1 child, and 1 spouse for testing
          // selectPicklistDependent('spousy-3332'); // spouse with marriage ended
          selectPicklistDependent('penny-3479'); // child who married
          selectPicklistDependent('peter-0104'); // parent who died

          continueFromPicklist();
        });
      },

      // Spouse followup pages
      'remove-dependent/spouse-reason-to-remove': () => {
        // Don't use afterHook - it causes autofill to run first
        // Instead, manually interact with the page and click continue
        cy.wait(500); // Wait for React rendering
        cy.get('@testData').then(data => {
          getCurrentDependent(data, spouse => {
            if (spouse?.removalReason) {
              selectRadioWebComponent('removalReason', spouse.removalReason);
            }
            cy.clickFormContinue();
          });
        });
      },

    },
    // skip: Cypress.env('CI'),
  },

  manifest,
  formConfig,
);

testForm(testConfig);
