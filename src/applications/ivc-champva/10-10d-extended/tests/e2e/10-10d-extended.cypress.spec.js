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
      'signer-information/mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressAndGoToNext('certifierAddress', data.certifierAddress);
          });
        });
      },
      'sponsor-information/address': ({ afterHook }) => {
        afterHook(() => selectSharedAddressAndGoToNext('not-shared'));
      },
      'sponsor-information/mailing-address': ({ afterHook }) => {
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
    },
    setupPerTest: () => setupBasicTest(),
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
