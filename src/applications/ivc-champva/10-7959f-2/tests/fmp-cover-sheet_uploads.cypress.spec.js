import path from 'path';
import environment from 'platform/utilities/environment';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import {
  reviewAndSubmitPageFlow,
  verifyAllDataWasSubmitted,
  getAllPages,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';
import mockUploadResponse1 from './e2e/fixtures/mocks/upload-response-1.json';
import mockUploadResponse2 from './e2e/fixtures/mocks/upload-response-2.json';
import mockUploadResponse3 from './e2e/fixtures/mocks/upload-response-3.json';

/**
 * This purpose of this E2E test is to verify that the va-file-input-multiple component
 * works as expected in the normal form flow. It tests uploading multiple files
 * to the veteran payment docs page when the user selects "Veteran" as the payment
 * recipient.
 */

const UPLOAD_URL = `${
  environment.API_URL
}/ivc_champva/v1/forms/submit_supporting_documents`;
// Define fixture paths relative to Cypress fixtures directory
const TEST_FILE_PATH_1 = 'data/example_upload.png';
const TEST_FILE_PATH_2 = 'data/example_upload2.png';
const TEST_FILE_PATH_3 = 'data/example_upload3.png';

const ALL_PAGES = getAllPages(formConfig);

/**
 * Helper function to upload a file to a file input and verify upload completes
 * @param {string} fixturePath - Path to the fixture file relative to fixtures folder
 * @param {string} fileInputSelector - CSS class to identify which file input to use ('no-file' for empty inputs)
 * @param {Object} mockResponse - The mock response object to use for this file upload
 */
const uploadFileAndVerify = (
  fixturePath,
  fileInputSelector = 'no-file',
  mockResponse = mockUploadResponse1,
) => {
  // Mock the file upload for this specific action
  cy.intercept('POST', `${UPLOAD_URL}*`, {
    statusCode: 200,
    body: mockResponse,
  }).as(`upload-${fixturePath}`);

  // Select the appropriate file input based on selector
  const inputSelector = `va-file-input.${fileInputSelector}`;

  // Use selectFile to directly upload the fixture file
  cy.get('va-file-input-multiple')
    .shadow()
    .find(inputSelector)
    .first()
    .shadow()
    .find('input[type="file"]')
    .selectFile(
      `src/applications/ivc-champva/10-7959f-2/tests/e2e/fixtures/${fixturePath}`,
      { force: true },
    );

  // Verify no errors occurred during upload
  cy.get('va-file-input-multiple', { timeout: 500 }).should(
    'not.have.class',
    'has-error',
  );
};

/**
 * Helper function to verify uploaded files are displayed in the review page
 * @param {Array<Object>} files - Array of file objects with name and size properties
 * @param {string} accordionSelector - CSS selector for the accordion item containing file info
 */
const verifyFilesInReview = (
  files,
  accordionSelector = 'va-accordion-item[data-chapter="fileUpload"]',
) => {
  cy.get(accordionSelector).within(() => {
    // Check for file names and sizes
    files.forEach(file => {
      cy.findByText(file.name).should('exist');
      cy.findByText(file.size).should('exist');
    });
  });
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
    dataSets: ['test-data.json'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      [ALL_PAGES.page3.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'veteranAddress',
              data.veteranAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page4a.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'physicalAddress',
              data.physicalAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      // Test the file upload functionality on the veteran payment docs page
      [ALL_PAGES.page7.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          // Upload two files with their specific mock responses
          uploadFileAndVerify(TEST_FILE_PATH_1, 'no-file', mockUploadResponse1);
          uploadFileAndVerify(TEST_FILE_PATH_2, 'no-file', mockUploadResponse2);

          // Verify that two files are now displayed
          cy.get('va-file-input-multiple')
            .shadow()
            .find('va-file-input.has-file')
            .should('have.length', 2);

          // Change a file with its specific mock response
          uploadFileAndVerify(
            TEST_FILE_PATH_3,
            'has-file',
            mockUploadResponse3,
          );

          // Verify that we still have exactly two files displayed (one was replaced, not added)
          cy.get('va-file-input-multiple')
            .shadow()
            .find('va-file-input.has-file')
            .should('have.length', 2);

          // Click the first DELETE button and confirm deletion
          cy.get('va-file-input-multiple')
            .shadow()
            .find('va-file-input.has-file')
            .first()
            .shadow()
            .find('va-button-icon[aria-label*="delete"]')
            .click();

          // Confirm deletion in the modal dialog
          cy.get('va-modal')
            .shadow()
            .find('button')
            .contains('Yes, remove this')
            .click();

          // Verify that only one file remains after deletion
          cy.get('va-file-input-multiple')
            .shadow()
            .find('va-file-input.has-file')
            .should('have.length', 1);

          cy.axeCheck();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          // Verify only the second uploaded file is listed in the review page
          // The first file was deleted after being replaced with example_upload3.png
          verifyFilesInReview([{ name: 'example_upload2.png', size: '4 KB' }]);

          cy.axeCheck();

          cy.get('@testData').then(data => {
            // Complete the review and submit process
            reviewAndSubmitPageFlow(data.statementOfTruthSignature, `Submit`);
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);

      // Mock form submission
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(dataPreTransform => {
          // Verify that the uploaded file data is included in the submission
          verifyAllDataWasSubmitted(
            JSON.parse(
              formConfig.transformForSubmit(formConfig, {
                data: dataPreTransform,
              }),
            ),
            req.body,
          );
        });
        // Mock response
        req.reply({ status: 200 });
      });

      cy.config('includeShadowDom', true);
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
