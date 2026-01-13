/**
 * E2E test for blocked issues on 996 form.
 */
import path from 'path';

import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { CONTESTABLE_ISSUES_API, SUBMIT_URL } from '../constants/apis';

import { CONTESTABLE_ISSUES_PATH } from '../../shared/constants';

import { fixDecisionDates, startApp } from '../../shared/tests/cypress.helpers';
import { parseDateWithOffset } from '../../shared/utils/dates';
import cypressSetup from '../../shared/tests/cypress.setup';

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
    useWebComponentFields: true,
    dataPrefix: 'data',

    dataSets: ['minimal-test-v2'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      start: () => {
        cy.get('@testData').then(() => {
          cy.get('va-radio-option[value="compensation"]').click();
          cy.axeCheck();
          cy.findByText(/review online/i, { selector: 'a' }).click();
        });
      },

      introduction: ({ afterHook }) => {
        afterHook(() => {
          startApp();
        });
      },

      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();

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
        cy.contains('Traumatic Brain Injury').should('exist');

        afterHook(() => {
          cy.get('va-checkbox')
            .first()
            .click();

          cy.clickFormContinue();
        });
      },

      'area-of-disagreement/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('va-checkbox')
            .first()
            .click();
          cy.clickFormContinue();
        });
      },

      'informal-conference': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            const rep =
              testData.informalConferenceChoice ||
              ['me', 'rep'].includes(testData.informalConference)
                ? 'yes'
                : 'no';
            cy.get(`va-radio-option[value="${rep}"]`).click();
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },

      'informal-conference/contact': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            const rep = testData.informalConference;
            cy.get(`va-radio-option[value="${rep}"]`).click();
            cy.injectAxeThenAxeCheck();
            cy.clickFormContinue();
          });
        });
      },
    },

    skip: ['review-and-submit'],

    setupPerTest: () => {
      cypressSetup();

      setStoredSubTask({ benefitType: 'compensation' });

      cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
      cy.intercept('POST', SUBMIT_URL, mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockPrefill);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);

        const combinedIssues = [
          ...mockBlockedIssuesData,
          ...fixDecisionDates(data.contestedIssues, { unselected: true }),
        ];

        cy.intercept('GET', `/${CONTESTABLE_ISSUES_API}/compensation`, {
          data: combinedIssues,
        }).as('getIssues');
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
