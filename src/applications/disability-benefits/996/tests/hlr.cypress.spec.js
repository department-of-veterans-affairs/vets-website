import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import { WIZARD_STATUS } from 'applications/static-pages/wizard';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import { mockContestableIssues } from './hlr.cypress.helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-test', 'minimal-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        cy.get('[type="radio"][value="compensation"]').click();
        cy.get('[type="radio"][value="legacy-no"]').click();
        cy.axeCheck();
        cy.findByText(/request/i, { selector: 'button' }).click();
        afterHook(() => {
          // Hit the start button
          cy.findAllByText(/start/i, { selector: 'button' })
            .first()
            .click();
        });
      },
    },

    setupPerTest: () => {
      window.sessionStorage.removeItem(WIZARD_STATUS);

      cy.login();

      cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');

      cy.route(
        'GET',
        '/v0/higher_level_reviews/contestable_issues/compensation',
        mockContestableIssues,
      );

      cy.route('PUT', '/v0/in_progress_forms/*', 'fx:mocks/in-progress-forms');

      cy.route(
        'POST',
        '/v0/higher_level_reviews',
        'fx:mocks/application-submit',
      );

      cy.get('@testData').then(testData => {
        cy.route('GET', '/v0/in_progress_forms/20-0996', testData);
      });
    },

    // disable all tests until HLR is in production
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
