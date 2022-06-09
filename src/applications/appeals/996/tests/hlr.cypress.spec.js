import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import {
  mockContestableIssues,
  getRandomDate,
  // fixDecisionDates,
} from './hlr.cypress.helpers';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUser from './fixtures/mocks/user.json';
import { CONTESTABLE_ISSUES_API, WIZARD_STATUS, SELECTED } from '../constants';

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
          cy.get('[type="radio"][value="compensation"]').click();
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
      'additional-issues': () => {
        cy.get('@testData').then(data => {
          data.additionalIssues.forEach((item, index) => {
            if (index !== 0) {
              cy.get('.va-growable-add-btn')
                .first()
                .click();
            }

            cy.get(`input[name$="${index}_issue"]`)
              .first()
              .clear()
              .type(item.issue);
            const date = getRandomDate()
              .replace(/-0/g, '-')
              .split('-');
            cy.get(`select[name$="${index}_decisionDateMonth"]`).select(
              date[1],
            );
            cy.get(`select[name$="${index}_decisionDateDay"]`).select(date[2]);
            cy.get(`input[name$="${index}_decisionDateYear"]`)
              .clear()
              .type(date[0]);
            cy.get('.update')
              .first()
              .click({ force: true });
            if (!item[SELECTED]) {
              cy.get(
                `input[type="checkbox"][name="root_additionalIssues_${index}"]`,
              )
                .first()
                // remove auto-check if not selected in data
                .click({ force: true });
            }
          });
        });
      },
    },

    setupPerTest: () => {
      window.sessionStorage.removeItem(WIZARD_STATUS);

      cy.login(mockUser);

      cy.intercept('GET', '/v0/profile/status', mockStatus);

      cy.intercept(
        'GET',
        `/v0${CONTESTABLE_ISSUES_API}compensation`,
        mockContestableIssues,
      );
      cy.intercept(
        'GET',
        `/v1${CONTESTABLE_ISSUES_API}compensation`,
        mockContestableIssues,
      );

      cy.intercept('PUT', '/v0/in_progress_forms/20-0996', mockInProgress);

      cy.intercept('POST', '/v0/higher_level_reviews', mockSubmit);
      cy.intercept('POST', '/v1/higher_level_reviews', mockSubmit);

      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0996', testData);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0996', testData);
        cy.intercept('GET', '/v0/feature_toggles?*', {
          data: { features: [] },
        });
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
