import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  createSummaryHandler,
  fillAddressAndGoToNext,
  selectSharedAddressAndGoToNext,
  setupBasicTest,
  startAsGuestUser,
} from './utils';

// define handlers for ArrayBuilder sections
const handleApplicantSummary = createSummaryHandler('root_view:hasApplicants');

// define test config
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => startAsGuestUser());
      },
      'your-information/mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressAndGoToNext('certifierAddress', data.certifierAddress);
          });
        });
      },
      'veteran-information/address': ({ afterHook }) => {
        afterHook(() => selectSharedAddressAndGoToNext('not-shared'));
      },
      'veteran-information/mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressAndGoToNext('sponsorAddress', data.sponsorAddress);
          });
        });
      },
      'applicant-information/summary': ({ afterHook }) => {
        afterHook(() => handleApplicantSummary());
      },
      'applicant-information/:index/address': ({ afterHook }) => {
        afterHook(() => selectSharedAddressAndGoToNext('not-shared'));
      },
      'applicant-information/:index/mailing-address': ({
        afterHook,
        index,
      }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressAndGoToNext(
              'applicantAddress',
              data.applicants[index].applicantAddress,
            );
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('va-statement-of-truth')
              .shadow()
              .within(() => {
                cy.get('va-text-input').then($el =>
                  cy.fillVaTextInput($el, data.statementOfTruthSignature),
                );
                cy.get('va-checkbox').then($el =>
                  cy.selectVaCheckbox($el, true),
                );
              });
            cy.findByText(/submit/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => setupBasicTest(),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
