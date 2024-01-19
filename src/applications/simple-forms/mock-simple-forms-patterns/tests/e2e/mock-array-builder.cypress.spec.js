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
  yield 'ADD_THEN_CANCEL';
  yield 'ADDING_ITEM_1';
  yield 'ADDING_ITEM_2';
  yield 'EDITING_ITEM_1';
  yield 'GO_TO_ITEM_2_PAGE_2';
  yield 'BACK_TWICE_TO_SUMMARY';
  yield 'REMOVE_ITEM_1';
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
  cy.selectYesNoVaRadioOption('root_hasEmployment', hasEmployment);
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

function summaryEditItem1() {
  cy.axeCheck();
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employers_0"] [data-action="edit"]').click();
}

function summaryEditItem2() {
  cy.axeCheck();
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employers_1"] [data-action="edit"]').click();
}

function editItemPage1() {
  cy.url().should('include', 'edit=true');
  cy.get('va-button[data-action="cancel"]').should('not.exist');
  cy.fillVaTextInput('root_name', 'Updated Name');
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function editItemPage2() {
  cy.url().should('include', 'edit=true');
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function editItemPage1Skip() {
  cy.url().should('include', 'edit=true');
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function pressBackItemPage1() {
  cy.findByText(/back/i, { selector: 'button' }).click();
}

function pressBackItemPage2() {
  cy.findByText(/back/i, { selector: 'button' }).click();
}

function cancelItemPage1() {
  cy.url().should('include', 'add=true');
  cy.get('va-button[data-action="cancel"]').click();
  cy.axeCheck();
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('h2')
    .should('contain', 'Are you sure you want to cancel adding this employer?');
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('.va-modal-alert-body va-button')
    .first()
    .click();
  cy.get('va-card').should('have.length', 0);
  goNextState();
}

function removeItem1() {
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employers_0"] [data-action="remove"]').click();
  cy.axeCheck();
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('h2')
    .should('contain', 'Are you sure you want to remove this employer?');
  cy.get('va-modal[status="warning"]')
    .shadow()
    .get('.va-modal-alert-body va-button')
    .first()
    .click();
  cy.get('va-card').should('have.length', 1);
  cy.axeCheck();
  cy.selectYesNoVaRadioOption('root_hasEmployment', false);
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

const routeItem1Page1 = 'array-multiple-page-builder-item-page-1/0';
const routeItem1Page2 = 'array-multiple-page-builder-item-page-2/0';
const routeItem2Page1 = 'array-multiple-page-builder-item-page-1/1';
const routeItem2Page2 = 'array-multiple-page-builder-item-page-2/1';

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
      [pagePaths.arrayMultiPageBuilderStart]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'ADD_THEN_CANCEL':
              case 'ADDING_ITEM_1':
              case 'ADDING_ITEM_2':
                summaryAddMore(true);
                break;
              case 'EDITING_ITEM_1':
                summaryEditItem1();
                break;
              case 'GO_TO_ITEM_2_PAGE_2':
                summaryEditItem2();
                break;
              case 'REMOVE_ITEM_1':
                removeItem1();
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
              case 'ADD_THEN_CANCEL':
                cancelItemPage1();
                break;
              case 'ADDING_ITEM_1':
                addItemPage1();
                break;
              case 'EDITING_ITEM_1':
                editItemPage1();
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
              case 'ADDING_ITEM_1':
                addItemPage2();
                goNextState();
                break;
              case 'EDITING_ITEM_1':
                editItemPage2();
                goNextState();
                break;
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
              case 'ADDING_ITEM_2':
                addItemPage1();
                break;
              case 'GO_TO_ITEM_2_PAGE_2':
                editItemPage1Skip();
                goNextState();
                break;
              case 'BACK_TWICE_TO_SUMMARY':
                pressBackItemPage1();
                goNextState();
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
              case 'ADDING_ITEM_2':
                addItemPage2();
                goNextState();
                break;
              case 'BACK_TWICE_TO_SUMMARY':
                pressBackItemPage2();
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
