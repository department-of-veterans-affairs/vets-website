import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import { statementOfTruthFullNamePath } from '../../config/helpers';
import {
  fillAddressWebComponentPattern,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';
import mockUser from './fixtures/mocks/user.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: [
      'veteran-active-compensation-minimal-test',
      'veteran-active-compensation-maximal-test',
    ],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/^start your intent to file/i, {
            selector: 'a',
          }).click({ force: true });
        });
      },
      [formConfig.additionalRoutes[0].path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {});
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
      cy.intercept('GET', '**/get_intents_to_file', {
        compensationIntent: {
          expirationDate: '2025-01-30T17:56:30.512Z',
          status: 'active',
        },
      });
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);

      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
