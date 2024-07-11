import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillStandardTextInput,
  fillTextWebComponent,
  selectRadioWebComponent,
  selectYesNoWebComponent,
} from './helpers';

import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const SUBMISSION_DATE = new Date().toISOString();
const SUBMISSION_CONFIRMATION_NUMBER = '01e77e8d-79bf-4991-a899-4e2defff11e0';

let addedUnassociatedIncomeItem = false;
let addedAssociatedIncomeItem = false;
let addedOwnedAssetItem = false;

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: '21P-0969 Income and Asset Statement Form',
    dataPrefix: 'data',
    dataSets: ['test-data'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('a.vads-c-action-link--green')
            .contains('Start the Application')
            .click({ force: true });
        });
      },
      'unassociated-incomes-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingUnassociatedIncomes =
              data['view:isAddingUnassociatedIncomes'];
            if (addedUnassociatedIncomeItem) {
              isAddingUnassociatedIncomes = false;
              addedUnassociatedIncomeItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingUnassociatedIncomes',
              isAddingUnassociatedIncomes,
            );

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'unassociated-incomes/0/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { unassociatedIncomes } = data;
            const {
              incomeType,
              grossMonthlyIncome,
              payer,
            } = unassociatedIncomes[0];

            selectRadioWebComponent('incomeType', incomeType);
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillTextWebComponent('payer', payer);

            addedUnassociatedIncomeItem = true;

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'associated-incomes-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingAssociatedIncomes =
              data['view:isAddingAssociatedIncomes'];
            if (addedAssociatedIncomeItem) {
              isAddingAssociatedIncomes = false;
              addedAssociatedIncomeItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingAssociatedIncomes',
              isAddingAssociatedIncomes,
            );

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'associated-incomes/0/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { associatedIncomes } = data;
            const {
              incomeType,
              grossMonthlyIncome,
              accountValue,
              payer,
            } = associatedIncomes[0];

            selectRadioWebComponent('incomeType', incomeType);
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillStandardTextInput('accountValue', accountValue);
            fillTextWebComponent('payer', payer);

            addedAssociatedIncomeItem = true;

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'owned-assets-summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let isAddingOwnedAssets = data['view:isAddingOwnedAssets'];
            if (addedOwnedAssetItem) {
              isAddingOwnedAssets = false;
              addedOwnedAssetItem = false;
            }

            selectYesNoWebComponent(
              'view:isAddingOwnedAssets',
              isAddingOwnedAssets,
            );

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'owned-assets/0/income-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { ownedAssets } = data;
            const {
              incomeType,
              grossMonthlyIncome,
              accountValue,
              payer,
            } = ownedAssets[0];

            selectRadioWebComponent('incomeType', incomeType);
            fillStandardTextInput('grossMonthlyIncome', grossMonthlyIncome);
            fillStandardTextInput('accountValue', accountValue);
            fillTextWebComponent('payer', payer);

            addedOwnedAssetItem = true;

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('#veteran-signature')
              .shadow()
              .find('input')
              .first()
              .type(data.statementOfTruthSignature);
            cy.get(`#veteran-certify`)
              .first()
              .shadow()
              .find('input')
              .click({ force: true });
            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', `v0/${formConfig.submitUrl}`, {
        data: {
          id: 'mock-id',
          type: 'saved_income_and_asset_claim',
          attributes: {
            submittedAt: SUBMISSION_DATE,
            regionalOffice: [
              'Attention:  Philadelphia Pension Center',
              'P.O. Box 5206',
              'Janesville, WI 53547-5206',
            ],
            confirmationNumber: SUBMISSION_CONFIRMATION_NUMBER,
            guid: '01e77e8d-79bf-4991-a899-4e2defff11e0',
            form: '21P-0969',
          },
        },
      }).as('submitApplication');

      cy.login(mockUser);
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  // skip: [],
  manifest,
  formConfig,
);

testForm(testConfig);
