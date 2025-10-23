import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { introductionPageFlow } from 'applications/simple-forms/shared/tests/e2e/helpers';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import pagePaths from './pagePaths';

let nextState;

function* stateSequence() {
  yield '1_ADD_ITEM';
  yield '2_GO_TO_REVIEW';
  yield '3_DELETE_ITEM_FROM_REVIEW';
  yield '4_CANCEL_ADDING';
  yield '5_CONFIRM_ERROR';
  yield '6_ADD_ANOTHER_ITEM';
  yield '7_FINISH';
}

const stateMachine = stateSequence();

function goNextState() {
  const state = stateMachine.next();
  if (!state.done) {
    cy.log(`
**********
State change: ${state.value}
**********
`);
    nextState = state.value;
  }
}

function summaryAddMore(hasEmployment) {
  cy.selectYesNoVaRadioOption('root_view:hasEmployment', hasEmployment);
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function summaryFinishAdding() {
  cy.selectYesNoVaRadioOption('root_view:hasEmployment', false);
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function addItemPage1() {
  cy.url().should('include', 'add=true');
  cy.fillPage();
  cy.selectVaSelect('root_address_state', 'AL');
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function addItemPage2() {
  cy.url().should('include', 'add=true');
  cy.fillPage();
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function addItemFromReviewPage() {
  cy.get('va-button[name="employersAddButton"]').click();
}

/**
 * @param {'add' | 'edit' | 'review'} type
 */
function cancelItemPage(type) {
  cy.url().should('include', `${type}=true`);
  cy.get('va-button[data-action="cancel"]').click();
  cy.axeCheck();
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('h2')
    .should('include', /cancel/gi);
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('.va-modal-alert-body va-button')
    .first()
    .click();
}

function removeItemFromReviewCard() {
  cy.get('va-accordion-item[data-chapter="arrayMultiPageBuilder"]').click();
  cy.get('va-card[name="employer_0"] [data-action="remove"]').click();
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('h2')
    .should('contain', 'Delete');
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('.va-modal-alert-body va-button')
    .first()
    .click();
}

const routeItem1Page1 = 'array-multiple-page-builder/0/name-and-address';
const routeItem1Page2 = 'array-multiple-page-builder/0/dates';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['arrayBuilder'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      'chapter-select': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`va-button[text="Deselect all"]`).click();
          cy.selectVaCheckbox('root_chapterSelect_arrayMultiPageBuilder', true);
          goNextState();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      [pagePaths.arrayMultiPageBuilderFlow]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.selectVaRadioOption(
              'root_arrayBuilderPatternFlowType',
              'required',
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.arrayMultiPageBuilderIntro]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.arrayMultiPageBuilderSummary]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case '1_ADD_ITEM':
                summaryAddMore(true);
                break;
              case '2_GO_TO_REVIEW':
                cy.get('va-card').should('have.length', 1);
                summaryFinishAdding();
                goNextState();
                break;
              case '7_FINISH':
                cy.get('va-card').should('have.length', 1);
                summaryFinishAdding();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem1Page1]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case '1_ADD_ITEM':
              case '6_ADD_ANOTHER_ITEM':
                addItemPage1();
                break;
              case '4_CANCEL_ADDING':
                cancelItemPage('add');
                goNextState();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem1Page2]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case '1_ADD_ITEM':
              case '6_ADD_ANOTHER_ITEM':
                addItemPage2();
                goNextState();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case '3_DELETE_ITEM_FROM_REVIEW':
                removeItemFromReviewCard();
                goNextState();
                break;
              case '5_CONFIRM_ERROR':
                cy.get(
                  'va-alert[name="employersReviewError"][status="error"]',
                ).should('exist');
                addItemFromReviewPage();
                goNextState();
                break;
              case '7_FINISH':
                cy.findAllByText(/Submit application/i, {
                  selector: 'button',
                }).click();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
