import path from 'path';
import _ from 'lodash';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { filterViewFields } from 'platform/forms-system/src/js/helpers';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import environment from 'platform/utilities/environment';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  verifyAllDataWasSubmitted,
  reviewAndSubmitPageFlow,
  selectRadioWebComponent,
  getAllPages,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';
import { goToNextPage, uploadDocumentAndGoToNext } from './e2e/utils';

const ALL_PAGES = getAllPages(formConfig);

const UPLOAD_URL = `${
  environment.API_URL
}/ivc_champva/v1/forms/submit_supporting_documents`;

const SAMPLE_FILE = path.join(
  __dirname,
  'e2e/fixtures/data/example_upload.png',
);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    dataSets: [
      'basic-resubmission.json',
      'test-data.json',
      'military-address-no-ohi-pharmacy-work.json',
      'third-party-foreign-address-ohi-medical-claim-work-auto.json',
      'two-ohi-other-type.json',
      'no-packet.json',
    ],

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
            reviewAndSubmitPageFlow(sig);
          });
        });
      },
      // When we land on this screener page, progressing through the form is
      // blocked (by design). To successfully complete the test,
      // once we land here, change `certifierReceivedPacket` to `true`
      // and click '<< Back' so that we can proceed past the screener
      [ALL_PAGES.page1a2.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.injectAxeThenAxeCheck();
            if (data.certifierReceivedPacket === false) {
              // eslint-disable-next-line no-param-reassign
              data.certifierReceivedPacket = true;
              // This targets the 'Back to previous page' button
              cy.get('va-link[back="true"]').click({ force: true });
            }
          });
        });
      },
      [ALL_PAGES.page1b.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'certifierAddress',
              data.certifierAddress,
            );
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      [ALL_PAGES.page1e2.path]: ({ afterHook }) => {
        afterHook(() => uploadDocumentAndGoToNext(SAMPLE_FILE));
      },
      [ALL_PAGES.page1e3.path]: ({ afterHook }) => {
        afterHook(() => uploadDocumentAndGoToNext(SAMPLE_FILE));
      },
      [ALL_PAGES.page2d.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'applicantAddress',
              data.applicantAddress,
            );
            selectRadioWebComponent(
              'applicantNewAddress',
              data.applicantNewAddress,
            );
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      [ALL_PAGES.page7.path]: ({ afterHook }) => {
        afterHook(() => uploadDocumentAndGoToNext(SAMPLE_FILE));
      },
      [ALL_PAGES.page8.path]: ({ afterHook }) => {
        afterHook(() => uploadDocumentAndGoToNext(SAMPLE_FILE));
      },
      [ALL_PAGES.page9.path]: ({ afterHook }) => {
        afterHook(() => uploadDocumentAndGoToNext(SAMPLE_FILE));
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
          const withoutViewFields = filterViewFields(data);
          verifyAllDataWasSubmitted(withoutViewFields, req.body);
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
