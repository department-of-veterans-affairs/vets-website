import path from 'path';
import _ from 'lodash';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import environment from 'platform/utilities/environment';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  verifyAllDataWasSubmitted,
  reviewAndSubmitPageFlow,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

// For intercepting file uploads:
const UPLOAD_URL = `${
  environment.API_URL
}/ivc_champva/v1/forms/submit_supporting_documents`;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['test-data.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const sig = _.get(
              data,
              formConfig.preSubmitInfo.statementOfTruth.fullNamePath(data),
            );
            reviewAndSubmitPageFlow(
              sig,
              `Submit ${formConfig.customText.appType}`,
            );
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
              name: 'file.png',
              size: '123',
            },
          },
        },
      });
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          // Remove the "do you have another policy to add?" yes/no view-only prop
          // before checking data validity. (have to include it so test proceeds)
          // eslint-disable-next-line no-param-reassign
          delete data['view:hasPolicies'];
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
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
