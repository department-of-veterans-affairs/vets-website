import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import { getSignerFullName } from './helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import {
  getPagePaths,
  fillAddressWebComponentPattern,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';

const pagePaths = getPagePaths(formConfig);
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['flow1', 'flow2', 'flow3', 'flow4'],

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
            const { first, last } = data.witnessFullName;
            const label = data.witnessRelationshipToClaimant;
            cy.get('#root_witnessFullName_first')
              .clear()
              .type(first);
            cy.get('#root_witnessFullName_last')
              .clear()
              .type(last);
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
      [pagePaths.veteranMailingAddressInfo1]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'veteranMailingAddress',
              data.veteranMailingAddress,
            );

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.claimantAddrInfoPage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.claimantMailingAddress) {
              fillAddressWebComponentPattern(
                'claimantMailingAddress',
                data.claimantMailingAddress,
              );

              cy.axeCheck('.form-panel');
              cy.findByText(/continue/i, { selector: 'button' }).click();
            }
          });
        });
      },
      'witness-personal-information-b': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { first, last } = data.witnessFullName;
            const label = data.witnessRelationshipToClaimant;
            cy.get('#root_witnessFullName_first')
              .clear()
              .type(first);
            cy.get('#root_witnessFullName_last')
              .clear()
              .type(last);
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
            reviewAndSubmitPageFlow(signerName, 'Submit statement');
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
