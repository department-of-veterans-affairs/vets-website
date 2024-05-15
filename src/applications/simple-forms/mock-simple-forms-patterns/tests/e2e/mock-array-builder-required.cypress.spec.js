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
  yield 'EDIT_CANCEL_BACK_TO_SUMMARY';
  yield 'REMOVE_ITEM_1';
  yield 'REVIEW_EDIT_ITEM_1';
  yield 'REVIEW_CONFIRM_EDIT';
  yield 'REVIEW_EDIT_THEN_CANCEL';
  yield 'FINISH';
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
  cy.get('va-card[name="employer_0"] [data-action="edit"]').click();
}

function summaryEditItem2() {
  cy.axeCheck();
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employer_1"] [data-action="edit"]').click();
}

function editItemPage1() {
  cy.url().should('include', 'edit=true');
  cy.get('va-button[data-action="cancel"]').should('exist');
  cy.fillVaTextInput('root_name', 'Updated Name');
  cy.get('va-button[continue]').click();
}

function editItemFromReviewPage1() {
  cy.url().should('include', 'edit=true');
  cy.get('va-button[data-action="cancel"]').should('exist');
  cy.fillVaTextInput('root_name', 'From review');
  cy.get('va-button[continue]').click();
}

function editItemPage2() {
  cy.url().should('include', 'edit=true');
  cy.get('va-button[continue]').click();
}

function editItemPage1Skip() {
  cy.url().should('include', 'edit=true');
  cy.get('va-button[continue]').click();
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

function removeItem1() {
  cy.get('va-card').should('have.length', 2);
  cy.get('va-card[name="employer_0"] [data-action="remove"]').click();
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
}

function reviewClickEditItem1() {
  cy.get('va-accordion-item[data-chapter="arrayMultiPageBuilder"]').click();
  cy.get('va-card[name="employer_0"] [data-action="edit"]').click();
}

const routeItem1Page1 = 'array-multiple-page-builder/0/name-and-address';
const routeItem1Page2 = 'array-multiple-page-builder/0/dates';
const routeItem2Page1 = 'array-multiple-page-builder/1/name-and-address';
const routeItem2Page2 = 'array-multiple-page-builder/1/dates';

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
                cy.findByText(/continue/i, { selector: 'button' }).click();
                goNextState();
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
                cancelItemPage('add');
                cy.url().should('include', 'array-multiple-page-builder');
                cy.url().should('not.include', 'summary');
                cy.url().should('not.include', 'name-and-address');
                cy.url().should('not.include', 'dates');
                goNextState();
                break;
              case 'ADDING_ITEM_1':
                addItemPage1();
                break;
              case 'EDITING_ITEM_1':
                editItemPage1();
                break;
              case 'REVIEW_EDIT_ITEM_1':
                editItemFromReviewPage1();
                break;
              case 'REVIEW_EDIT_THEN_CANCEL':
                cancelItemPage('review');
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
              case 'ADDING_ITEM_1':
                addItemPage2();
                goNextState();
                break;
              case 'EDITING_ITEM_1':
              case 'REVIEW_EDIT_ITEM_1':
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
              case 'EDIT_CANCEL_BACK_TO_SUMMARY':
                cancelItemPage('edit');
                cy.get('va-card').should('have.length', 2);
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
              case 'REVIEW_EDIT_ITEM_1':
                reviewClickEditItem1();
                break;
              case 'REVIEW_CONFIRM_EDIT':
                cy.get('va-alert[name="employer_0"][status="success"]').should(
                  'exist',
                );
                goNextState();
                reviewClickEditItem1();
                break;
              case 'FINISH':
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
