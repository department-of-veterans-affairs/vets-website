/**
 * E2E test for Notice of Disagreement (10182) form.
 */
import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/mock-upload.json';
import {
  SUBMIT_URL,
  EVIDENCE_UPLOAD_API,
  CONTESTABLE_ISSUES_API,
} from '../constants/apis';
import { CONTESTABLE_ISSUES_PATH, SELECTED } from '../../shared/constants';
import cypressSetup from '../../shared/tests/cypress.setup';
import * as h from '../../shared/tests/cypress.helpers';

const verifyUrl = link => h.verifyCorrectUrl(manifest.rootUrl, link);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    // Rename and modify the test data as needed.
    dataSets: ['no-api-issues', 'minimal-test', 'maximal-test'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          h.startApp();
        });
      },
      'veteran-information': () => {
        cy.wait('@getIssues');
        cy.clickFormContinue();
      },
      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.clickFormContinue();
            // prevent continuing without any issues selected
            verifyUrl(CONTESTABLE_ISSUES_PATH);

            testData.additionalIssues?.forEach(additionalIssue => {
              if (additionalIssue.issue && additionalIssue[SELECTED]) {
                cy.get('.add-new-issue').click();
                verifyUrl('/add-issue?index=');
                cy.injectAxeThenAxeCheck();
                cy.fillVaTextInput('issue-name', additionalIssue.issue);
                cy.fillDate('decision-date', h.getRandomDate());
                cy.get('#submit').click();
              }
            });

            testData.contestedIssues?.forEach(issue => {
              if (issue[SELECTED]) {
                cy.get(
                  `label:contains("${
                    issue.attributes.ratingIssueSubjectText
                  }")`,
                )
                  .closest('li')
                  .find('input[type="checkbox"]')
                  .click();
              }
            });

            cy.clickFormContinue();
          });
        });
      },
      'extension-reason': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();

        afterHook(() => {
          cy.get('@testData').then(testData => {
            const { extensionReason } = testData;

            if (extensionReason) {
              cy.get('va-textarea')
                .shadow()
                .find('textarea')
                .type(extensionReason);
            }

            cy.clickFormContinue();
          });
        });
      },
      'area-of-disagreement/:index': h.areaOfDisagreementPageHook,
      'evidence-submission/upload': () => {
        cy.get('input[type="file"]')
          .upload(
            path.join(__dirname, 'fixtures/data/example-upload.pdf'),
            'testing',
          )
          .get('.schemaform-file-uploading')
          .should('not.exist');
      },
    },
    setupPerTest: () => {
      cypressSetup();

      cy.intercept('POST', EVIDENCE_UPLOAD_API, mockUpload);
      cy.intercept('POST', SUBMIT_URL, mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/10182', mockPrefill);
        cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
        cy.intercept('GET', CONTESTABLE_ISSUES_API, {
          data: h.fixDecisionDates(data.contestedIssues, { unselected: true }),
        }).as('getIssues');
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
