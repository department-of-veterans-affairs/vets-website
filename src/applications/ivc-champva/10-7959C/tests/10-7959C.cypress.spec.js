import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  selectRadioWebComponent,
  getAllPages,
  verifyAllDataWasSubmitted,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

// Put all page objects into an object where pagename maps to page data
// E.g., {page1: {path: '/blah'}}
const ALL_PAGES = getAllPages(formConfig);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    /*
    1. test-data: standard run-through of the form
    The rest of the tests are described by their filenames and are just
    variations designed to trigger the conditionals in the form/follow different paths.
    */
    dataSets: [
      'not-enrolled-champva.json',
      'test-data.json',
      'maximal-test.json',
      'minimal-test.json',
      'no-medicare-yes-ohi.json',
      'no-medicare-yes-primary.json',
      'yes-medicare-no-ohi.json',
      'yes-medicare-yes-primary.json',
    ],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      // When we land on this screener page, progressing through the form is
      // blocked (by design). To successfully complete the test,
      // once we land here, change `champvaBenefitStatus` to `true`
      // and click '<< Back' so that we can proceed past the screener
      [ALL_PAGES.benefitApp.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.injectAxeThenAxeCheck();
            if (data.champvaBenefitStatus === false) {
              // eslint-disable-next-line no-param-reassign
              data.champvaBenefitStatus = true;
              // This targets the '<< Back' button
              cy.get('.usa-button-secondary').click();
            }
          });
        });
      },
      [ALL_PAGES.applicantAddressInfo.path]: ({ afterHook }) => {
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
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.missingFileConsent.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.selectVaCheckbox(
              `consent-checkbox`,
              data.consentToMailMissingRequiredFiles,
            );
            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.primaryComments.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('va-textarea')
              .shadow()
              .get('#input-type-textarea')
              .type(data.primaryAdditionalComments, { force: true });
            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.secondaryComments.path]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('va-textarea')
              .shadow()
              .get('#input-type-textarea')
              .type(data.secondaryAdditionalComments, { force: true });
            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('va-text-input')
              .shadow()
              .get('#inputField')
              .type(data.signature, { force: true });
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
