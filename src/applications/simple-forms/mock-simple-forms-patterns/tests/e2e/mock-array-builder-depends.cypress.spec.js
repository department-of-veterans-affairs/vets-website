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
  yield 'SKIP_SUMMARY_NO_ITEMS';
  yield 'ADDING_ITEM_1_NO_DEPENDS';
  yield 'ADDING_ITEM_2_WITH_DEPENDS';
  yield 'SKIP_SUMMARY_WITH_LAST_ITEM_HAS_DEPENDS';
  yield 'EDITING_ITEM_2_WITH_DEPENDS';
  yield 'REMOVE_ITEM_2';
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

function addItemPage1NoDepends() {
  cy.url().should('include', 'add=true');
  cy.fillPage();
  cy.selectVaSelect('root_address_state', 'AL');
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function addItemPage1WithDepends() {
  cy.url().should('include', 'add=true');
  cy.fillPage();
  cy.selectVaSelect('root_address_state', 'CA'); // depends trigger
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function addItemPage2() {
  cy.url().should('include', 'add=true');
  cy.fillPage();
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function summaryEditItem2() {
  cy.axeCheck();
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employer_1"] [data-action="edit"]').click();
}

function editItemPage1() {
  cy.url().should('include', 'name-and-address');
  cy.get('va-button[continue]').click();
}

function editItemPage2() {
  cy.url().should('include', 'dates');
  cy.get('va-button[continue]').click();
}

function editItemPage3() {
  cy.url().should('include', 'optional');
  cy.get('va-button[continue]').click();
}

function removeItem2() {
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employer_1"] [data-action="remove"]').click();
  cy.axeCheck();
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('h2')
    .should('contain', 'Delete');
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('.va-modal-alert-body va-button')
    .first()
    .click();
  cy.get('va-card').should('have.length', 1);
  cy.axeCheck();
  cy.selectYesNoVaRadioOption('root_view:hasEmployment', false);
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

const routeItem1Page1 = 'array-multiple-page-builder/0/name-and-address';
const routeItem1Page2 = 'array-multiple-page-builder/0/dates';
const routeItem1Page3 = 'array-multiple-page-builder/0/optional';
const routeItem2Page1 = 'array-multiple-page-builder/1/name-and-address';
const routeItem2Page2 = 'array-multiple-page-builder/1/dates';
const routeItem2Page3 = 'array-multiple-page-builder/1/optional';
const reviewAndSubmit = 'review-and-submit';

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
      [pagePaths.arrayMultiPageBuilderSummary]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'SKIP_SUMMARY_NO_ITEMS':
                summaryAddMore(false);
                break;
              case 'ADDING_ITEM_1_NO_DEPENDS':
              case 'ADDING_ITEM_2_WITH_DEPENDS':
                summaryAddMore(true);
                break;
              case 'SKIP_SUMMARY_WITH_LAST_ITEM_HAS_DEPENDS':
                cy.get('va-card').should('have.length', 2);
                summaryAddMore(false);
                break;
              case 'EDITING_ITEM_2_WITH_DEPENDS':
                summaryEditItem2();
                break;
              case 'REMOVE_ITEM_2':
                removeItem2();
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
            if (nextState === 'ADDING_ITEM_1_NO_DEPENDS') {
              addItemPage1NoDepends();
            } else {
              throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem1Page2]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'ADDING_ITEM_1_NO_DEPENDS') {
              addItemPage2();
              goNextState();
            } else {
              throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem1Page3]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'ADDING_ITEM_1_NO_DEPENDS':
              case 'ADDING_ITEM_2_WITH_DEPENDS':
                throw new Error(
                  'Unexpected nextState - Item 1 should not have a page 3 unless user selected California for their address state',
                );
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem2Page1]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'ADDING_ITEM_2_WITH_DEPENDS':
                addItemPage1WithDepends();
                break;
              case 'GO_TO_ITEM_2_PAGE_2':
                editItemPage1();
                break;
              case 'EDITING_ITEM_2_WITH_DEPENDS':
                editItemPage1();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem2Page2]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'ADDING_ITEM_2_WITH_DEPENDS':
                addItemPage2();
                break;
              case 'EDITING_ITEM_2_WITH_DEPENDS':
                editItemPage2();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [routeItem2Page3]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'ADDING_ITEM_2_WITH_DEPENDS':
                goNextState();
                cy.findByText(/continue/i, { selector: 'button' }).click();
                break;
              case 'EDITING_ITEM_2_WITH_DEPENDS':
                editItemPage3();
                goNextState();
                break;
              default:
                throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [reviewAndSubmit]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'SKIP_SUMMARY_NO_ITEMS':
              case 'SKIP_SUMMARY_WITH_LAST_ITEM_HAS_DEPENDS':
                goNextState();
                cy.findByText(/back/i, { selector: 'button' }).click();
                break;
              case 'REMOVE_ITEM_2':
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
