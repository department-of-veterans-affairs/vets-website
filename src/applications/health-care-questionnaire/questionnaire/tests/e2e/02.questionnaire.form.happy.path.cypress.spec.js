import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import basicUser from './fixtures/users/user-basic.js';

import { setSessionStorage } from '../../../shared/test-data/e2e/session.storage.mock';

import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';

import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

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
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
      cy.login(basicUser);
      disableFTUXModals();

      cy.window().then(window => {
        const apptId =
          'I2-3PYJBEU2DIBW5RZT2XI3PASYGM7YYRD5TFQCLHQXK6YBXREQK5VQ0005';
        setSessionStorage(window, apptId);
      });
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/Answer/i, {
            selector: '.vads-c-action-link--green',
          })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      demographics: ({ afterHook }) => {
        cy.findByTestId('fullName').contains('Calvin C Fletcher', {
          matchCase: true,
        });
        afterHook(() => {
          cy.findAllByText(/continue/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      // 'reason-for-visit': ({afterHook}) => {  },
      'review-and-submit': () => {
        cy.route({
          method: 'POST',
          url: '/health_quest/v0/questionnaire_manager',
          status: 200,
          response: {
            body: {
              resourceType: 'QuestionnaireResponse',
              id: 'b18e0750-456d-41c9-a1a7-753bf66165f2',
              meta: {
                tag: [],
              },
              text: {},
              identifier: {},
              questionnaire: 'Questionnaire/test-123',
              status: 'completed',
              subject: {},
              authored: '2021-05-05T15:07:32+00:00',
              source: {},
              item: [],
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
