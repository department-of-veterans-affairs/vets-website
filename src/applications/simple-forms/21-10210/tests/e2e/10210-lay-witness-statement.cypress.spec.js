import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import { getSignerFullName } from './helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import user from './fixtures/mocks/user.json';
import {
  fillFullNameWebComponentPattern,
  getPagePaths,
  reviewAndSubmitPageFlow,
  selectCheckboxGroupWebComponent,
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
          cy.get('a.vads-c-action-link--green').click();
        });
      },
      'witness-personal-information-a': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'witnessFullName',
              data.witnessFullName,
            );
            selectCheckboxGroupWebComponent(data.witnessRelationshipToClaimant);
            cy.findByText('Continue')
              .first()
              .click();
          });
        });
      },
      [pagePaths.veteranMailingAddressInfo1]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
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
              cy.fillAddressWebComponentPattern(
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
            fillFullNameWebComponentPattern(
              'witnessFullName',
              data.witnessFullName,
            );
            selectCheckboxGroupWebComponent(data.witnessRelationshipToClaimant);
            cy.findByText('Continue')
              .first()
              .click();
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
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
