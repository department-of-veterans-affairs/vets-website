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
  yield 'ADD_GO_TO_PAGE_3';
  yield 'ADD_TEST_HIDE_AND_EXPAND';
  yield 'EDIT_GO_TO_PAGE_3';
  yield 'EDIT_TEST_HIDE_AND_EXPAND';
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
  cy.selectVaSelect('root_address_state', 'CA'); // depends trigger
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function editItemPage1() {
  cy.url().should('include', 'edit=true');
  cy.get('va-button[continue]').click();
}

function addItemPage2() {
  cy.url().should('include', 'add=true');
  cy.fillPage();
  cy.axeCheck();
  cy.findByText(/continue/i, { selector: 'button' }).click();
}

function summaryEditItem1() {
  cy.axeCheck();
  cy.get('va-card').should('have.length', 1);
  cy.get('va-card[name="employer_0"] [data-action="edit"]').click();
}

function editItemPage2() {
  cy.url().should('include', 'dates');
  cy.get('va-button[continue]').click();
}

function testHideAndExpand() {
  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('va-radio[name="root_raining"]').should('have.length', 0);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 0);

  cy.fillVaTextInput('root_weather', 'rain');
  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('.form-expanding-group').should(
    'not.have.class',
    'form-expanding-group-open',
  );
  cy.get('va-radio[name="root_raining"]').should('have.length', 1);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 0);

  cy.selectVaRadioOption('root_raining', 'Y');
  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('.form-expanding-group').should(
    'have.class',
    'form-expanding-group-open',
  );
  cy.get('va-radio[name="root_raining"]').should('have.length', 1);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 1);

  cy.selectVaRadioOption('root_raining', 'N');
  cy.fillVaTextInput('root_weather', 'sunny');

  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('va-radio[name="root_raining"]').should('have.length', 0);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 0);
}

function testEditHideAndExpand() {
  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('va-radio[name="root_raining"]').should('have.length', 0);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 0);

  cy.fillVaTextInput('root_weather', 'rain');
  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('.form-expanding-group').should(
    'not.have.class',
    'form-expanding-group-open',
  );
  cy.get('va-radio[name="root_raining"]').should('have.length', 1);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 0);

  cy.selectVaRadioOption('root_raining', 'Y');
  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('.form-expanding-group').should(
    'have.class',
    'form-expanding-group-open',
  );
  cy.get('va-radio[name="root_raining"]').should('have.length', 1);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 1);

  cy.selectVaRadioOption('root_raining', 'N');
  cy.fillVaTextInput('root_weather', 'sunny');

  cy.get('va-text-input[name="root_weather"]').should('have.length', 1);
  cy.get('va-radio[name="root_raining"]').should('have.length', 0);
  cy.get('va-text-input[name="root_umbrella"]').should('have.length', 0);
}

const routeItem1Page1 = 'array-multiple-page-builder/0/name-and-address';
const routeItem1Page2 = 'array-multiple-page-builder/0/dates';
const routeItem1Page3 = 'array-multiple-page-builder/0/optional';
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
              case 'FINISH':
                summaryAddMore(false);
                break;
              case 'ADD_GO_TO_PAGE_3':
                summaryAddMore(true);
                break;
              case 'EDIT_GO_TO_PAGE_3':
                summaryEditItem1();
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
            if (nextState === 'ADD_GO_TO_PAGE_3') {
              addItemPage1();
            } else if (nextState === 'EDIT_GO_TO_PAGE_3') {
              editItemPage1();
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
            if (nextState === 'ADD_GO_TO_PAGE_3') {
              addItemPage2();
              goNextState();
            } else if (nextState === 'EDIT_GO_TO_PAGE_3') {
              editItemPage2();
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
            if (nextState === 'ADD_TEST_HIDE_AND_EXPAND') {
              testHideAndExpand();
              goNextState();
              cy.findByText(/continue/i, { selector: 'button' }).click();
            } else if (nextState === 'EDIT_TEST_HIDE_AND_EXPAND') {
              testEditHideAndExpand();
              goNextState();
              cy.get('va-button[continue]').click();
            } else {
              throw new Error(`Unexpected nextState: ${nextState}`);
            }
          });
        });
      },
      [reviewAndSubmit]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'FINISH') {
              cy.findAllByText(/Submit application/i, {
                selector: 'button',
              }).click();
            } else {
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
