import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { getRandomDate, fixDecisionDates } from './hlr.cypress.helpers';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUser from './fixtures/mocks/user.json';
import mockVamc from './fixtures/mocks/vamc-ehr.json';
import mockUserAvail from './fixtures/mocks/user_transition_availabilities.json';

import {
  CONTESTABLE_ISSUES_API,
  WIZARD_STATUS,
  SELECTED,
  BASE_URL,
  CONTESTABLE_ISSUES_PATH,
} from '../constants';

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
      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(testData => {
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
    },

    setupPerTest: () => {
      window.sessionStorage.removeItem(WIZARD_STATUS);

      cy.login(mockUser);

      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);
      cy.intercept('GET', '/v0/feature_toggles?*', { data: { features: [] } });
      cy.intercept('GET', '/v0/user_transition_availabilities', mockUserAvail);

      cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);

      cy.intercept('POST', '/v1/higher_level_reviews', mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0996', mockPrefill);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);
        cy.intercept('GET', `/v1${CONTESTABLE_ISSUES_API}compensation`, {
          data: fixDecisionDates(data.contestedIssues, { unselected: true }),
        });
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
