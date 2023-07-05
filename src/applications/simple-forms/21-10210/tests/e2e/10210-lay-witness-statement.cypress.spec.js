import path from 'path';
import cloneDeep from 'lodash/cloneDeep';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import origFormConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import { getSignerFullName } from './helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

// Disable formConfig props that were meant for local-dev only.
const formConfig = cloneDeep(origFormConfig);
formConfig.dev = {};
formConfig.chapters.statementInfoChapter.pages.claimOwnershipPage.initialData = {
  data: {},
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['flow2'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start/i, { selector: 'button' });
          cy.findByText(/without signing in/i).click({ force: true });
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
            const signerName = getSignerFullName(data);
            cy.get('#veteran-signature')
              .first()
              .shadow()
              .find('input')
              .first()
              .type(signerName);
            cy.get(`input[name="veteran-certify"]`).check();
            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },

    setupPerTest: () => {
      Cypress.config({ defaultCommandTimeout: 8000 });
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
