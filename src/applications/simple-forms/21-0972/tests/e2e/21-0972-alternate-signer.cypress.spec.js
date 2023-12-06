import path from 'path';
import cloneDeep from 'lodash/cloneDeep';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import {
  fillAddressWebComponentPattern,
  introductionPageFlow,
  reviewAndSubmitPageFlow,
  selectGroupCheckboxWidget,
} from '../../../shared/tests/e2e/helpers';

import { preparerQualificationsQuestionLabels } from '../../config/helpers';
import { claimantIdentificationDisplayOptions } from '../../definitions/constants';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import pagePaths from './pagePaths';

// Disable formConfig props that were meant for local-dev only.
const testFormConfig = cloneDeep(formConfig);
testFormConfig.dev = {};
testFormConfig.chapters.preparerPersonalInformationChapter.pages.preparerPersonalInformation.initialData = {
  data: {},
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      [pagePaths.preparerAddress]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'preparerAddress',
              data.preparerAddress,
            );

            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.claimantAddress]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'claimantAddress',
              data.claimantAddress,
            );

            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.preparerQualifications1A]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const label = preparerQualificationsQuestionLabels(
              claimantIdentificationDisplayOptions[data.claimantIdentification],
            )[1];
            selectGroupCheckboxWidget(label);

            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.preparerQualifications1B]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const label = preparerQualificationsQuestionLabels(
              claimantIdentificationDisplayOptions[data.claimantIdentification],
            )[1];
            selectGroupCheckboxWidget(label);

            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.preparerQualifications2]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectGroupCheckboxWidget(data.preparerSigningReason);

            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const signerName = data.preparerFullName;
            reviewAndSubmitPageFlow(signerName, 'Submit form');
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', testFormConfig.submitUrl, mockSubmit);
    },
  },
  manifest,
  testFormConfig,
);

testForm(testConfig);
