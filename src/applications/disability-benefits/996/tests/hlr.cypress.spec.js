import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { mockContestableIssues } from './hlr.cypress.helpers';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUser from './fixtures/mocks/user.json';
import { CONTESTABLE_ISSUES_API, WIZARD_STATUS } from '../constants';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-test-v1', 'minimal-test-v1', 'maximal-test-v2'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      start: () => {
        // wizard
        cy.get('[type="radio"][value="compensation"]').click();
        cy.get('[type="radio"][value="legacy-no"]').click();
        cy.axeCheck();
        cy.findByText(/review online/i, { selector: 'a' }).click();
      },

      introduction: ({ afterHook }) => {
        afterHook(() => {
          if (Cypress.env('CI')) {
            cy.get('[type="radio"][value="compensation"]').click();
            cy.get('[type="radio"][value="legacy-no"]').click();
            cy.axeCheck();
            cy.findByText(/review online/i, { selector: 'a' }).click();
          }
          // Hit the start button
          cy.findAllByText(/start/i, { selector: 'button' })
            .first()
            .click();
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

      cy.intercept('PUT', 'v0/in_progress_forms/20-0996', mockInProgress);

      cy.intercept('POST', '/v0/higher_level_reviews', mockSubmit);

      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0996', testData);
        cy.intercept('PUT', 'v0/in_progress_forms/20-0996', testData);

        const features = testData.hlrV2 ? [{ name: 'hlrV2', value: true }] : [];
        cy.intercept('GET', '/v0/feature_toggles?*', { data: { features } });
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
