import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { mockContestableIssues } from './hlr.cypress.helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: [
      // disable all test until HLR is in production
      // 'maximal-test',
      // 'minimal-test',
    ],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    pageHooks: {
      introduction: () => {
        // Hit the start button
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },
    },
    setupPerTest: () => {
      cy.login();

      cy.route('GET', '/v0/feature_toggles*', 'fx:mocks/feature-toggles');

      cy.route('GET', '/v0/appeals/contestable_issues', mockContestableIssues);

      cy.route('PUT', '/v0/in_progress_forms/*', 'fx:mocks/in-progress-forms');

      cy.route(
        'POST',
        '/v0/appeals/higher_level_reviews',
        'fx:mocks/application-submit',
      );

      cy.get('@testData').then(data => {
        cy.route('GET', 'v0/in_progress_forms/20-0996', {
          formData: {
            veteran: {
              phoneNumber: '5033333333',
              emailAddress: 'mike.wazowski@gmail.com',
              ssnLastFour: '9876',
              vaFileNumber: '8765',
              addressLine1: '1200 Park Ave',
              addressLine2: '',
              addressLine3: '',
              city: 'Emeryville',
              countryCode: 'USA',
              stateOrProvinceCode: 'CA',
              zipPostalCode: '94608',
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
  },
  manifest,
  formConfig,
);

testForm(testConfig);
