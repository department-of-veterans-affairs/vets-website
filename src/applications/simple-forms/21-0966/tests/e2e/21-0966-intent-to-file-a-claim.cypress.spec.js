import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import { statementOfTruthFullNamePath } from '../../config/helpers';
import {
  fillAddressWebComponentPattern,
  introductionPageFlow,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: [
      'veteran-minimal-test',
      'veteran-maximal-test',
      'surviving-minimal-test',
      'surviving-maximal-test',
      'third-party-veteran-minimal-test',
      'third-party-veteran-maximal-test',
      'third-party-surviving-minimal-test',
      'third-party-surviving-maximal-test',
    ],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      [formConfig.chapters.survivingDependentContactInformationChapter.pages
        .survivingDependentMailingAddress.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'survivingDependentMailingAddress',
              data.survivingDependentMailingAddress,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formConfig.chapters.veteranContactInformationChapter.pages
        .veteranMailingAddress.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'veteranMailingAddress',
              data.veteranMailingAddress,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(
              data[statementOfTruthFullNamePath({ formData: data })],
            );
          });
        });
      },
    },

    setupPerTest: () => {
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
