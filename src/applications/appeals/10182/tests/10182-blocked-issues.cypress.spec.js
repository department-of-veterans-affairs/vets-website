/**
 * E2E test for blocked issues on 10182 form.
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

import {
  CONTESTABLE_ISSUES_PATH,
  NOD_BASE_URL,
  SELECTED,
} from '../../shared/constants';
import cypressSetup from '../../shared/tests/cypress.setup';
import { parseDateWithOffset } from '../../shared/utils/dates';

import {
  fixDecisionDates,
  getRandomDate,
  areaOfDisagreementPageHook,
  startApp,
} from '../../shared/tests/cypress.helpers';

const today = parseDateWithOffset({});

const mockBlockedIssuesData = [
  {
    type: 'contestableIssue',
    attributes: {
      ratingIssueSubjectText: 'blocked issue (today)',
      description: 'This issue should be blocked due to same day decision',
      ratingIssuePercentNumber: '30',
      approxDecisionDate: today,
      decisionIssueId: 1,
      ratingIssueReferenceId: '1',
      ratingDecisionReferenceId: null,
    },
  },
];

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          startApp();
        });
      },

      'veteran-information': () => {
        cy.wait('@getIssues');
        cy.clickFormContinue();
      },

      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();

        // E2E test: Verify blocked issues alert appears with correct content
        cy.get('#blocked-issues-alert').should('exist');
        cy.get('#blocked-issues-alert').should(
          'contain.text',
          "We're sorry. Your blocked issue (today) issue isn't available",
        );

        cy.get('#blocked-issues-alert')
          .should('contain', '12:00 a.m.')
          .and('not.contain', '5:00 p.m.');

        cy.contains('blocked issue (today)').should('exist');
        cy.get('va-checkbox').should('exist');

        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.clickFormContinue();

            cy.location('pathname').should(
              'eq',
              `${NOD_BASE_URL}/${CONTESTABLE_ISSUES_PATH}`,
            );

            testData.additionalIssues?.forEach(additionalIssue => {
              if (additionalIssue.issue && additionalIssue[SELECTED]) {
                cy.get('.add-new-issue').click();
                cy.url().should('include', `${NOD_BASE_URL}/add-issue?index=`);
                cy.axeCheck();
                cy.fillVaTextInput('issue-name', additionalIssue.issue);
                cy.fillDate('decision-date', getRandomDate());
                cy.get('#submit').click();
              }
            });

            cy.get('va-checkbox')
              .first()
              .click();

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

    skip: ['review-and-submit'],

    setupPerTest: () => {
      cypressSetup();

      cy.intercept('POST', EVIDENCE_UPLOAD_API, mockUpload);
      cy.intercept('POST', SUBMIT_URL, mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/10182', mockPrefill);
        cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);

        const combinedIssues = [
          ...mockBlockedIssuesData,
          ...fixDecisionDates(data.contestedIssues, { unselected: true }),
        ];

        cy.intercept('GET', CONTESTABLE_ISSUES_API, {
          data: combinedIssues,
        }).as('getIssues');
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
