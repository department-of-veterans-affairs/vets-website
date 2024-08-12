import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/mock-upload.json';
import { CONTESTABLE_ISSUES_API } from '../constants';

import {
  CONTESTABLE_ISSUES_PATH,
  NOD_BASE_URL,
  SELECTED,
} from '../../shared/constants';
import cypressSetup from '../../shared/tests/cypress.setup';
import {
  fixDecisionDates,
  getRandomDate,
  areaOfDisagreementPageHook,
} from '../../shared/tests/cypress.helpers';

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
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },

      'veteran-information': () => {
        cy.wait('@getIssues');
        cy.findByText('Continue', { selector: 'button' }).click();
      },

      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.findByText('Continue', { selector: 'button' }).click();
            // prevent continuing without any issues selected
            cy.location('pathname').should(
              'eq',
              `${NOD_BASE_URL}/${CONTESTABLE_ISSUES_PATH}`,
            );

            testData.additionalIssues?.forEach(additionalIssue => {
              if (additionalIssue.issue && additionalIssue[SELECTED]) {
                cy.get('.add-new-issue').click();
                cy.url().should('include', `${NOD_BASE_URL}/add-issue?index=`);
                cy.axeCheck();
                cy.get('#issue-name')
                  .shadow()
                  .find('input')
                  .type(additionalIssue.issue);
                cy.fillDate('decision-date', getRandomDate());
                cy.get('#submit').click();
              }
            });
            testData.contestedIssues?.forEach(issue => {
              if (issue[SELECTED]) {
                cy.get(
                  `h4:contains("${issue.attributes.ratingIssueSubjectText}")`,
                )
                  .closest('li')
                  .find('input[type="checkbox"]')
                  .click();
              }
            });
            cy.findByText('Continue', { selector: 'button' }).click();
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
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },

      'area-of-disagreement/:index': areaOfDisagreementPageHook,

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

      cy.intercept('POST', 'v0/decision_review_evidence', mockUpload);
      cy.intercept('POST', `v0/${formConfig.submitUrl}`, mockSubmit);
      cy.intercept('POST', `v1/${formConfig.submitUrl}`, mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/10182', mockPrefill);
        cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
        cy.intercept('GET', `/v0${CONTESTABLE_ISSUES_API}`, {
          data: fixDecisionDates(data.contestedIssues, { unselected: true }),
        }).as('getIssues');
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
