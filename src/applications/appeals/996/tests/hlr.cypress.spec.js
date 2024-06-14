import path from 'path';

import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { CONTESTABLE_ISSUES_API, BASE_URL } from '../constants';

import { CONTESTABLE_ISSUES_PATH, SELECTED } from '../../shared/constants';

import {
  getRandomDate,
  fixDecisionDates,
  areaOfDisagreementPageHook,
} from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-test-v2', 'minimal-test-v2'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      start: () => {
        cy.get('@testData').then(() => {
          // wizard
          cy.get('va-radio-option[value="compensation"]').click();
          cy.axeCheck();
          cy.findByText(/review online/i, { selector: 'a' }).click();
        });
      },

      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Hit the start button
          cy.findAllByText(/start the request/i, { selector: 'a' })
            .first()
            .click();
        });
      },

      'veteran-information': () => {
        cy.wait('@getIssues');
        cy.findByText('Continue', { selector: 'button' }).click();
      },

      homeless: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            const { homeless } = testData;
            cy.get(`va-radio-option[value="${homeless ? 'Y' : 'N'}"]`).click();
            cy.axeCheck();
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },

      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.findByText('Continue', { selector: 'button' }).click();
            // prevent continuing without any issues selected
            cy.location('pathname').should(
              'eq',
              `${BASE_URL}/${CONTESTABLE_ISSUES_PATH}`,
            );
            cy.get('va-alert[status="error"] h3').should(
              'contain',
              'You’ll need to select an issue',
            );

            testData.additionalIssues?.forEach(additionalIssue => {
              if (additionalIssue.issue && additionalIssue[SELECTED]) {
                cy.get('.add-new-issue').click();
                cy.url().should('include', `${BASE_URL}/add-issue?index=`);
                cy.axeCheck();
                cy.get('#issue-name')
                  .shadow()
                  .find('input')
                  .type(additionalIssue.issue);
                cy.fillDate('decision-date', getRandomDate());
                cy.get('#submit').click();
              }
            });
            testData.contestedIssues.forEach(issue => {
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

      'area-of-disagreement/:index': areaOfDisagreementPageHook,

      'informal-conference': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            const rep = testData.informalConference;
            cy.get(`va-radio-option[value="${rep}"]`).click();
            cy.axeCheck();
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },

      'informal-conference/representative-info': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            const rep = testData.informalConferenceRep;
            cy.get('[name="root_informalConferenceRep_firstName"]')
              .shadow()
              .find('input')
              .type(rep.firstName);
            cy.get('[name="root_informalConferenceRep_lastName"]')
              .shadow()
              .find('input')
              .type(rep.lastName);
            cy.get('[name="root_informalConferenceRep_phone"]')
              .shadow()
              .find('input')
              .type(rep.phone);
            cy.get('[name="root_informalConferenceRep_extension"]')
              .shadow()
              .find('input')
              .type(rep.extension);
            cy.get('[name="root_informalConferenceRep_email"]')
              .shadow()
              .find('input')
              .type(rep.email);
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      cypressSetup();

      setStoredSubTask({ benefitType: 'compensation' });

      cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
      cy.intercept('POST', '/v1/higher_level_reviews', mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockPrefill);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
        cy.intercept('GET', `/v1${CONTESTABLE_ISSUES_API}compensation`, {
          data: fixDecisionDates(data.contestedIssues, { unselected: true }),
        }).as('getIssues');
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
