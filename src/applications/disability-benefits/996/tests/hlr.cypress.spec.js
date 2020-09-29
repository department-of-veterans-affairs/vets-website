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

      cy.get('@testData').then(() => {
        cy.route('GET', '/v0/in_progress_forms/20-0996', {
          formData: {
            veteran: {
              phoneNumber: '5033333333',
              emailAddress: 'mike.wazowski@gmail.com',
              ssnLastFour: '9876',
              vaFileLastFour: '8765',
              street: '1200 Park Ave',
              street2: '',
              street3: '',
              city: 'Emeryville',
              country: 'USA',
              state: 'CA',
              zipCode5: '94608',
            },
          },
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/veteran-information',
          },
        });
      });
    },

    // disable all tests until HLR is in production
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
