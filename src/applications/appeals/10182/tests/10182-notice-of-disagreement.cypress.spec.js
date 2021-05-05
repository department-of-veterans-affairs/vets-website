import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { mockContestableIssues } from './nod.cypress.helpers';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/mock-upload.json';
import mockUser from './fixtures/mocks/user.json';
import { CONTESTABLE_ISSUES_API } from '../constants';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // Rename and modify the test data as needed.
    dataSets: ['maximal-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'button' })
            .last()
            .click();
        });
      },
      'eligible-issues': () => {
        cy.get('@testData').then(data => {
          data.additionalIssues.forEach((item, index) => {
            cy.get('.va-growable-add-btn')
              .first()
              .click();

            cy.get(`input[name^="root_additionalIssues_${index}"]`)
              .first()
              .clear()
              .type(item.issue);
            const date = item.decisionDate.replace(/-0/g, '-').split('-');
            cy.get(`select[name$="${index}_decisionDateMonth"]`).select(
              date[1],
            );
            cy.get(`select[name$="${index}_decisionDateDay"]`).select(date[2]);
            cy.get(`input[name$="${index}_decisionDateYear"]`)
              .clear()
              .type(date[0]);
            cy.get('.update')
              .first()
              .click();
          });
          cy.get('input[name="root_socOptIn"]').check();
        });
      },
    },

    setupPerTest: () => {
      cy.login(mockUser);

      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);

      cy.intercept(
        'GET',
        `/v0${CONTESTABLE_ISSUES_API}compensation`,
        mockContestableIssues,
      );

      cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);

      cy.intercept('POST', 'v0/decision_review_evidence', mockUpload);

      cy.route('POST', formConfig.submitUrl, mockSubmit);

      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/10182', testData);
        cy.intercept('PUT', 'v0/in_progress_forms/10182', testData);
      });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
