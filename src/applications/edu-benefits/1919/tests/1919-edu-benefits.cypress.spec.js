import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';

const mockManifest = {
  appName: 'Conflicting Interests Certification For Proprietary Schools',
  entryFile: './app-entry.jsx',
  entryName: '1919-edu-benefits',
  productId: 'b13f499a-24f7-4ff7-bf94-8c0dbe38a0e1',
  rootUrl: '/school-administrators/report-conflicting-interests',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['maximal-test.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('.schemaform-start-button')
            .first()
            .click();
        });
      },

      '/school-administrators/report-conflicting-interests/proprietary-profit-1/:index/details': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_affiliatedIndividuals_first', 'Mark');
          cy.fillVaTextInput('root_affiliatedIndividuals_last', 'Reeves');
          cy.fillVaTextInput('root_affiliatedIndividuals_title', 'Director');
          cy.selectVaRadioOption(
            'root_affiliatedIndividuals_individualAssociationType',
            'vaEmployee',
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/report-conflicting-interests/proprietary-profit-1': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.window().then(win => {
            const k = '__ppSummaryVisited';
            if (!win[k]) {
              // eslint-disable-next-line no-param-reassign
              win[k] = 1;
              cy.selectVaRadioOption('root_isProfitConflictOfInterest', 'Y');
            } else {
              cy.selectVaRadioOption('root_isProfitConflictOfInterest', 'N');
            }
          });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/report-conflicting-interests/conflict-of-interest/:index/certifying-official': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_certifyingOfficial_first', 'Jane');
          cy.fillVaTextInput('root_certifyingOfficial_last', 'Miller');
          cy.fillVaTextInput(
            'root_certifyingOfficial_title',
            'Certifying Official',
          );
          cy.tabToSubmitForm();
        });
      },

      '/school-administrators/report-conflicting-interests/conflict-of-interest/:index/file-number': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_fileNumber', '123456789');
          cy.tabToSubmitForm();
        });
      },

      '/school-administrators/report-conflicting-interests/conflict-of-interest/:index/enrollment-period': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaMemorableDate(
            'root_enrollmentPeriodStart',
            '2025-01-15',
            false,
          );
          cy.fillVaMemorableDate(
            'root_enrollmentPeriodEnd',
            '2025-06-15',
            false,
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/report-conflicting-interests/conflict-of-interest-summary': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.window().then(win => {
            const k = '__allPropSummaryVisited';
            if (!win[k]) {
              // eslint-disable-next-line no-param-reassign
              win[k] = true;
              cy.selectVaRadioOption(
                'root_allProprietaryConflictOfInterest',
                'Y',
              );
            } else {
              cy.selectVaRadioOption(
                'root_allProprietaryConflictOfInterest',
                'N',
              );
            }
          });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/report-conflicting-interests/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('#inputField', { timeout: 10000 }).type('Alice Johnson', {
            force: true,
          });
          cy.get('#checkbox-element').check({ force: true });
          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {},
    skip: Cypress.env('CI'),
  },
  mockManifest,
  formConfig,
);

testForm(testConfig);
