/**
 * E2E test for 996 form.
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
import { BASE_URL } from '../constants';
import { CONTESTABLE_ISSUES_API, SUBMIT_URL } from '../constants/apis';
import { CONTESTABLE_ISSUES_PATH, SELECTED } from '../../shared/constants';
import * as h from '../../shared/tests/cypress.helpers';
import cypressSetup from '../../shared/tests/cypress.setup';

const verifyUrl = link => h.verifyCorrectUrl(manifest.rootUrl, link);

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
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
          cy.injectAxeThenAxeCheck();
          cy.findByText(/review online/i, { selector: 'a' }).click();
        });
      },
      introduction: ({ afterHook }) => {
        afterHook(() => {
          h.startApp();
        });
      },
      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.clickFormContinue();
            cy.get('va-button[continue]', { selector: 'button' })
              .first()
              .click();
            // prevent continuing without any issues selected
            verifyUrl(CONTESTABLE_ISSUES_PATH);
            cy.get('va-alert[status="error"] h3').should(
              'contain',
              'You’ll need to select an issue',
            );

            testData.additionalIssues?.forEach(additionalIssue => {
              if (additionalIssue.issue && additionalIssue[SELECTED]) {
                cy.get('.add-new-issue').click();
                cy.url().should('include', `${BASE_URL}/add-issue?index=`);
                cy.injectAxeThenAxeCheck();
                cy.fillVaTextInput('issue-name', additionalIssue.issue);
                cy.fillDate('decision-date', h.getRandomDate());
                cy.get('#submit').click();
              }
            });
            testData.contestedIssues.forEach(issue => {
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
      'area-of-disagreement/:index': h.areaOfDisagreementPageHook,
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
    setupPerTest: () => {
      cypressSetup();

      setStoredSubTask({ benefitType: 'compensation' });

      cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
      cy.intercept('POST', SUBMIT_URL, mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockPrefill);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
        cy.intercept('GET', `/${CONTESTABLE_ISSUES_API}/compensation`, {
          data: h.fixDecisionDates(data.contestedIssues, { unselected: true }),
        }).as('getIssues');
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
