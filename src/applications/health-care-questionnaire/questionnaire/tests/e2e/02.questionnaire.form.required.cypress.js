import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import basicUser from './fixtures/users/user-basic.js';

const testConfig = createTestConfig(
  {
    appName: 'healthcare-questionnaire',
    dataSets: ['data'],
    arrayPages: [],
    dataPrefix: '',
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'this-visit'),
      mocks: path.join(__dirname, 'fixtures', 'this-visit'),
    },
    setupPerTest: () => {
      cy.route('GET', '/v0/feature_toggles?*', 'fx:mocks/feature-toggles');
      cy.login(basicUser);
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      demographics: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      'reason-for-visit': ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
          cy.get('#root_chiefComplaint-error-message').contains(
            'Please provide a response',
          );
          cy.get('#root_chiefComplaint').type('This is my reason...');
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      'review-and-submit': () => {
        cy.route({
          method: 'POST',
          url: '/v0/healthcare_questionnaire',
          status: 200,
          response: {
            body: {
              data: {
                id: '',
                type: 'clipboard_submission',
                attributes: {
                  submittedAt: '2020-08-06T19:18:11+00:00',
                },
              },
            },
          },
        });
      },
    },
    // disable all tests until we out of proof of concept stage
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
