import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  reviewAndSubmitPageFlow,
  fillAddressWebComponentPattern,
} from '../../shared/tests/helpers';

// Put all page objects into an object where pagename maps to page data
// E.g., {page1: {path: '/blah'}}
const ALL_PAGES = {};
Object.values(formConfig.chapters).forEach(ch =>
  Object.keys(ch.pages).forEach(p => {
    ALL_PAGES[p] = ch.pages[p];
  }),
);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    /* 
    1. test-data: standard run-through of the form
    2. no-secondary: no secondary insurance, certifierRole === 'applicant'
       (skips all certifier + secondary ins pages) 
    The rest of the tests are described by their filenames and are just
    variations designed to trigger the conditionals in the form. 
    */
    dataSets: [
      'test-data',
      'no-secondary.json',
      'applicant-maximal-test.json',
      'applicant-no-medicare-no-primary-no-secondary-test.json',
      'applicant-no-medicare-test.json',
      'applicant-no-primary-yes-secondary-test.json',
      'applicant-no-secondary-yes-primary-test.json',
      'thirdparty-no-medicare-no-primary-yes-secondary-test.json',
      'veteran-child-no-medicare-yes-primary-no-secondary-test.json',
      'veteran-spouse-medicare-no-ohi-test.json',
    ],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      [ALL_PAGES.address.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'certifierAddress',
              data.certifierAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.applicantAddressInfo.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'applicantAddress',
              data.applicantAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.missingFileConsent.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.selectVaCheckbox(
              `consent-checkbox`,
              data.consentToMailMissingRequiredFiles,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const name =
              data.certifierRole === 'applicant'
                ? data.applicantName
                : data.certifierName;
            reviewAndSubmitPageFlow(name);
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          Object.keys(data).forEach(k => {
            // Expect all original data used to populate the form
            // to be present in the submission - this is how we
            // know that pages we intended to fill didn't get skipped:

            // handle special cases:
            if (k.endsWith('MedigapPlan')) {
              // Grab last letter from original data ('medigapPlanK' -> 'K')
              expect(data[k].slice(-1)).to.equal(req.body[k]);
            } else if (typeof k === 'object') {
              // For objects with nested keys, just stringify and check
              // (easier for things like home address)
              expect(JSON.stringify(data[k])).to.equal(
                JSON.stringify(req.body[k]),
              );
            } else if (k.includes('DOB') || k.includes('Date')) {
              // Just check length match. There's a discrepancy in the
              // format of dates (goes from YYYY-MM-DD to MM-DD-YYYY).
              // TODO: Address discrepancy at some point.
              expect(data[k]?.length).to.equal(req.body[k]?.length);
            }
          });
        });
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
