import path from 'path';
import cloneDeep from 'lodash/cloneDeep';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import { getSignerFullName } from './helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

// Disable formConfig props that were meant for local-dev only.
const testFormConfig = cloneDeep(formConfig);
testFormConfig.dev = {};
testFormConfig.chapters.statementInfoChapter.pages.claimOwnershipPage.initialData = {
  data: {},
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['flow1', 'flow2', 'flow3', 'flow4'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start/i, { selector: 'button' });
          cy.get('.usa-alert-text .schemaform-start-button').click({
            force: true,
          });
        });
      },
      'witness-personal-information-a': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const label = data.witnessRelationshipToClaimant;
            cy.get(`va-checkbox[label="${label}"]`)
              .shadow()
              .get('#checkbox-element')
              .first()
              .click()
              .then(() => {
                cy.findByText('Continue')
                  .first()
                  .click();
              });
          });
        });
      },
      'witness-personal-information-b': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const label = data.witnessRelationshipToClaimant;
            cy.get(`va-checkbox[label="${label}"]`)
              .shadow()
              .get('#checkbox-element')
              .first()
              .click()
              .then(() => {
                cy.findByText('Continue')
                  .first()
                  .click();
              });
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const signerFullName = getSignerFullName(data);

            cy.get('#veteran-signature')
              .shadow()
              .get('#inputField')
              .type(signerFullName);
            cy.get(`input[name="veteran-certify"]`).check();
            cy.findAllByText(/Submit statement/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', testFormConfig.submitUrl, mockSubmit);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  testFormConfig,
);

testForm(testConfig);
