import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { setStoredSubTask } from 'platform/forms/sub-task';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import {
  mockContestableIssues,
  // getRandomDate,
  // fixDecisionDates,
} from './995.cypress.helpers';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import mockUser from './fixtures/mocks/user.json';
import { CONTESTABLE_ISSUES_API, PRIMARY_PHONE } from '../constants';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // dataDir: path.join(__dirname, 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['test-data'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Hit the start action link
          cy.findAllByText(/start your claim/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'primary-phone-number': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.selectRadio('primary', testData[PRIMARY_PHONE] || 'home');
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      cy.login(mockUser);
      setStoredSubTask({ benefitType: 'compensation' });

      cy.intercept('GET', '/v0/profile/status', mockStatus);
      cy.intercept('GET', '/v0/maintenance_windows', []);

      cy.intercept(
        'GET',
        `/v1${CONTESTABLE_ISSUES_API}compensation`,
        mockContestableIssues,
      );

      cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);

      cy.intercept('POST', '/v1/supplemental_claims', mockSubmit);

      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0995', testData);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0995', testData);
        cy.intercept('GET', '/v0/feature_toggles?*', {
          data: { features: [{ name: 'supplemental_claim', value: true }] },
        });
      });

      // cy.route('POST', formConfig.submitUrl, { status: 200 });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
