/**
 * This purpose of this E2E test is to verify that the optional/required
 * file upload custom component (`MissingFileOverview.jsx`) behaves as expected.
 *
 * The `MissingFileOverview` component shows a list of files that MAY
 * be uploaded, but are not required by the form. The user is presented
 * with a list of links to the file upload pages for missing files that he
 * may click if he wishes to go back in the form and upload. Then, the "continue"
 * button on the upload page will either redirect the user BACK to the
 * missing file overview screen, OR to the review-and-submit page (if no
 * further files are missing).
 *
 * This E2E test ensures that flow works as expected.
 */
import path from 'path';
import environment from 'platform/utilities/environment';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  fillAddressWebComponentPattern,
  selectRadioWebComponent,
  getAllPages,
  verifyAllDataWasSubmitted,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

// For intercepting file uploads:
const UPLOAD_URL = `${environment.API_URL}/ivc_champva/v1/forms/submit_supporting_documents`;

// Put all page objects into an object where pagename maps to page data
// E.g., {page1: {path: '/blah'}}
const ALL_PAGES = getAllPages(formConfig);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),

    dataSets: ['single-upload.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      // Address page has an extra radio for "is this a new address", so handle that
      [ALL_PAGES.applicantAddressInfo.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'applicantAddress',
              data.applicantAddress,
            );
            selectRadioWebComponent(
              'applicantNewAddress',
              data.applicantNewAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      // If the MissingFileOverview page has an action link, it means
      // we're missing a file. Click that link to go to the upload screen.
      [ALL_PAGES.supportingFilesReview.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('.vads-c-action-link--blue')
            .first()
            .click();
        });
      },
      // Skip upload page on first go so that we have a missing file
      // when we get to the overview. If we have the `fileReview` URL param
      // then we know we've already been to the overview page, so we will now
      // upload the front and back of our healthcare card and click "continue".
      [ALL_PAGES.primaryCard.path]: () => {
        cy.injectAxeThenAxeCheck();
        cy.url().then(url => {
          if (url.includes('fileReview')) {
            // Upload the two files:
            cy.get('input[type="file"]')
              .first()
              .upload(
                path.join(__dirname, 'e2e/fixtures/data/example_upload.png'),
                'testing',
              )
              .get('.schemaform-file-uploading')
              .should('not.exist');
            cy.get('input[type="file"]')
              .last()
              .upload(
                path.join(__dirname, 'e2e/fixtures/data/example_upload.png'),
                'testing',
              )
              .get('.schemaform-file-uploading')
              .should('not.exist');
          } else {
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          }
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            // Type in the signature, check the box, and submit
            cy.get('va-text-input')
              .shadow()
              .get('#inputField')
              .type(data.statementOfTruthSignature, { force: true });
            cy.get(`va-checkbox`)
              .shadow()
              .find('input')
              .click({ force: true });
            cy.findByText('Submit form', {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
      cy.intercept('POST', `${UPLOAD_URL}*`, {
        statusCode: 200,
        body: {
          data: {
            attributes: {
              confirmationCode: '1b39d28c-5d38-4467-808b-9da252b6e95a',
              isEncrypted: 'false',
              name: 'example_upload.png',
              size: '123',
            },
          },
        },
      });
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          verifyAllDataWasSubmitted(data, req.body);
        });
        // Mock response
        req.reply({ status: 200 });
      });
      cy.config('includeShadowDom', true);
      cy.config('retries', { runMode: 0 });
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
