import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../../config/form';
import manifest from '../../../manifest.json';

import basicUser from '../fixtures/users/user-basic.js';

import { setSessionStorage } from '../../../../shared/test-data/e2e/session.storage.mock';

import disableFTUXModals from '~/platform/user/tests/disableFTUXModals';

import featureToggles from '../fixtures/mocks/feature-toggles.enabled.json';

import sipPutData from '../fixtures/sip/put.json';
import sipDeleteData from '../fixtures/sip/delete.json';

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
      cy.intercept('POST', '/health_quest/v0/questionnaire_manager', {
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
      });
      cy.intercept('PUT', '/v0/in_progress_forms/**', sipPutData);
      cy.intercept('DELETE', '/v0/in_progress_forms/**', sipDeleteData);
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
          cy.get('.vads-c-action-link--green > span').click({
            waitForAnimations: true,
          });
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
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/submit/i, { selector: 'button' })
            .first()
            .click({ waitForAnimations: true });
        });
      },
      confirmation: () => {
        cy.get('.healthcare-questionnaire-confirm > .hydrated').contains(
          'has been sen',
        );
      },
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
