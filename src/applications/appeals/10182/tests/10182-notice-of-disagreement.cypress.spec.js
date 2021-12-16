import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { getRandomDate, fixDecisionDates } from './nod.cypress.helpers';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/mock-upload.json';
import mockUser from './fixtures/mocks/user.json';
import { CONTESTABLE_ISSUES_API, SELECTED } from '../constants';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // Rename and modify the test data as needed.
    dataSets: ['maximal-test', 'minimal-test'],

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
          data.contestableIssues.forEach((item, index) => {
            if (item[SELECTED]) {
              cy.get(`input[name="root_contestableIssues_${index}"]`)
                .first()
                .click({ force: true });
            }
          });
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
      'evidence-submission/upload': () => {
        cy.get('input[type="file"]')
          .upload(
            path.join(__dirname, 'fixtures/data/example-upload.pdf'),
            'application/pdf',
          )
          .get('.schemaform-file-uploading')
          .should('not.exist');
      },
    },

    setupPerTest: () => {
      cy.login(mockUser);

      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);

      cy.intercept('PUT', 'v0/in_progress_forms/10182', mockInProgress);

      cy.intercept('POST', 'v0/decision_review_evidence', mockUpload);

      cy.intercept('POST', formConfig.submitUrl, mockSubmit);

      cy.get('@testData').then(testData => {
        cy.intercept('GET', `/v0${CONTESTABLE_ISSUES_API}`, {
          data: fixDecisionDates(testData.contestableIssues),
        });

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
