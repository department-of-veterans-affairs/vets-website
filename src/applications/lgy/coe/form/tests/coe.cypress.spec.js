import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import mockUser from './fixtures/mocks/user.json';
import mockStatus from './fixtures/mocks/status.json';
import mockUpload from './fixtures/mocks/upload.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // Rename and modify the test data as needed.
    dataSets: ['maximal-test', 'minimal-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/request a certificate/i, { selector: 'a' })
            .last()
            .click();
        });
      },
      'mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillPage();
            // fillPage is not catching this state select, so we're doing it
            // manually here
            cy.get('select#root_applicantAddress_state').select(
              data.applicantAddress.state,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      // Log in if the form requires an authenticated session.
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);
      cy.intercept('PUT', 'v0/in_progress_forms/26-1880', mockInProgress);

      cy.intercept('GET', '/v0/coe/status', mockStatus);
      cy.intercept('GET', '/v0/in_progress_forms/26-1880', mockPrefill);
      cy.intercept('PUT', '/v0/in_progress_forms/26-1880', mockInProgress);
      cy.intercept('POST', '/v0/claim_attachments', mockUpload);

      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
