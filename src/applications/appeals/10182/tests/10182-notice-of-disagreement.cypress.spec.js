import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { fixDecisionDates, getRandomDate } from './nod.cypress.helpers';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUpload from './fixtures/mocks/mock-upload.json';
import mockUser from './fixtures/mocks/user.json';
import {
  CONTESTABLE_ISSUES_API,
  CONTESTABLE_ISSUES_PATH,
  BASE_URL,
  SELECTED,
} from '../constants';

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
              testData.contestableIssues?.length
                ? 'You’ll need to select an issue'
                : 'Sorry, we couldn’t find any eligible issues',
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
            testData.contestableIssues?.forEach(issue => {
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
      cy.login(mockUser);

      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);

      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('POST', 'v0/decision_review_evidence', mockUpload);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);

      cy.get('@testData').then(data => {
        cy.intercept('GET', '/v0/in_progress_forms/10182', mockPrefill);
        cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);
        cy.intercept('GET', `/v0${CONTESTABLE_ISSUES_API}`, {
          data: fixDecisionDates(data.contestableIssues, { unselected: true }),
        });
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
