import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  reviewAndSubmitPageFlow,
  fillAddressWebComponentPattern,
  getAllPages,
} from '../../shared/tests/helpers';

// Put all page objects into an object where pagename maps to page data
// E.g., {page1: {path: '/blah'}}
const ALL_PAGES = getAllPages(formConfig);

function missingValErrMsg(key, original, submitted) {
  return `Property with name ${key} and value ${
    original[key]
  } not found in submitted data (instead got ${submitted[key]})`;
}

function verifyAllDataWasSubmitted(data, req) {
  describe('Data submitted after E2E runthrough should include all data supplied in test file', () => {
    Object.keys(data).forEach(k => {
      // Expect all original data used to populate the form
      // to be present in the submission - this is how we
      // know that pages we intended to fill didn't get skipped:

      // handle special cases:
      if (k.endsWith('MedigapPlan')) {
        // Grab last letter from original data ('medigapPlanK' -> 'K')
        expect(data[k].slice(-1), missingValErrMsg(k, data, req.body)).to.equal(
          req.body[k],
        );
      } else if (k.includes('DOB') || k.includes('Date')) {
        // Just check length match. There's a discrepancy in the
        // format of dates (goes from YYYY-MM-DD to MM-DD-YYYY).
        // TODO: Address discrepancy at some point.
        expect(data[k]?.length, missingValErrMsg(k, data, req.body)).to.equal(
          req.body[k]?.length,
        );
      } else {
        expect(
          JSON.stringify(req.body[k]),
          missingValErrMsg(k, data, req.body),
        ).to.equal(JSON.stringify(data[k]));
      }
      // cy.axeCheck();
    });
  });
}

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    /* 
    1. test-data: standard run-through of the form
    2. no-secondary: no secondary insurance (skips all secondary ins pages) 
    The rest of the tests are described by their filenames and are just
    variations designed to trigger the conditionals in the form/follow different paths. 
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
            const name = data.applicantName;
            reviewAndSubmitPageFlow(name);
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          verifyAllDataWasSubmitted(data, req);
        });
        // Mock the backend response on form submit:
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
