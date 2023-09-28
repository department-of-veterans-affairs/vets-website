import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  getPagePaths,
  fillAddressWebComponentPattern,
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextWebComponent,
  introductionPageFlow,
  reviewAndSubmitPageFlow,
  selectYesNoWebComponent,
} from '../../../shared/tests/e2e/helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const pagePaths = getPagePaths(formConfig);
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      [pagePaths.veteranPersonalInfoPage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const {
              veteranFullName,
              veteranDateOfBirth,
              veteranDateOfDeath,
            } = data;

            fillFullNameWebComponentPattern('veteranFullName', veteranFullName);
            fillDateWebComponentPattern(
              'veteranDateOfBirth',
              veteranDateOfBirth,
            );
            fillDateWebComponentPattern(
              'veteranDateOfDeath',
              veteranDateOfDeath,
            );
            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.veteranIdentificationInfoPage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('veteranId_ssn', data.veteranId.ssn);

            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.requestTypePage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent('isFirstRequest', data.isFirstRequest);
            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.applicantPersonalInfoPage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'applicantFullName',
              data.applicantFullName,
            );
            cy.injectAxeThenAxeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.applicantAddressPage]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'applicantAddress',
              data.applicantAddress,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.applicantContactInfoPage]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('applicantPhone', data.applicantPhone);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { applicantFullName } = data;
            reviewAndSubmitPageFlow(applicantFullName, 'Submit request');
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept(formConfig.submitUrl, mockSubmit);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
