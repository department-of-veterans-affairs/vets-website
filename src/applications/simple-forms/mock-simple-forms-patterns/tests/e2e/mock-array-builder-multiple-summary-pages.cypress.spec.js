import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { introductionPageFlow } from 'applications/simple-forms/shared/tests/e2e/helpers';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const chooseFlowPage = 'array-multiple-page-builder-choose-flow';
const introPageA = 'array-multiple-page-builder';
const introPageB = 'array-multiple-page-builder-b';
const summaryPageA = 'array-multiple-page-builder-summary';
const summaryPageB = 'array-multiple-page-builder-summary-b';
const itemPage = 'array-multiple-page-builder/:index/name';

let nextState;

function* stateSequence() {
  yield 'CHOOSE_SIMPLE_A_REQUIRED_YESNO';
  yield 'VERIFY_INTRO_A';
  yield 'GO_BACK_CHANGE_TO_B';
  yield 'VERIFY_INTRO_B';
  yield 'GO_BACK_CHANGE_TO_OPTIONAL_A';
  yield 'VERIFY_SUMMARY_A_NO_ITEMS';
  yield 'ADD_ITEM_A';
  yield 'VERIFY_SUMMARY_A_WITH_ITEMS';
  yield 'GO_BACK_CHANGE_TO_B';
  yield 'VERIFY_SUMMARY_B_NO_ITEMS';
  yield 'ADD_ITEM_B';
  yield 'VERIFY_SUMMARY_B_WITH_ITEMS';
  yield 'SUBMIT';
}

const stateMachine = stateSequence();

function goNextState() {
  const state = stateMachine.next();
  if (!state.done) {
    cy.log(`State: ${state.value}`);
    nextState = state.value;
  }
}

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
      [chooseFlowPage]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            switch (nextState) {
              case 'CHOOSE_SIMPLE_A_REQUIRED_YESNO':
                cy.selectVaRadioOption('root_arrayBuilderItemPages', 'simple');
                cy.selectVaRadioOption(
                  'root_arrayBuilderSummaryIntroVariation',
                  'A',
                );
                cy.selectVaRadioOption(
                  'root_arrayBuilderPatternFlowType',
                  'required',
                );
                cy.selectVaRadioOption(
                  'root_arrayBuilderPatternInteractionType',
                  'yesNoQuestion',
                );
                goNextState();
                cy.findByText(/continue/i, { selector: 'button' }).click();
                break;

              case 'GO_BACK_CHANGE_TO_B':
                cy.selectVaRadioOption(
                  'root_arrayBuilderSummaryIntroVariation',
                  'B',
                );
                goNextState();
                cy.findByText(/continue/i, { selector: 'button' }).click();
                break;

              case 'GO_BACK_CHANGE_TO_OPTIONAL_A':
                cy.selectVaRadioOption(
                  'root_arrayBuilderPatternFlowType',
                  'optional',
                );
                cy.selectVaRadioOption(
                  'root_arrayBuilderSummaryIntroVariation',
                  'A',
                );
                goNextState();
                cy.findByText(/continue/i, { selector: 'button' }).click();
                break;

              default:
                throw new Error(
                  `Unexpected state in chooseFlowPage: ${nextState}`,
                );
            }
          });
        });
      },
      [introPageA]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'VERIFY_INTRO_A') {
              cy.contains(
                'Variation A: In the next few questions, we’ll ask you about your employers',
              ).should('exist');

              goNextState();
              cy.findByText(/back/i, { selector: 'button' }).click();
            } else {
              throw new Error(`Unexpected state in introPageA: ${nextState}`);
            }
          });
        });
      },
      [introPageB]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'VERIFY_INTRO_B') {
              cy.contains(
                'Variation B: Tell us about your work history',
              ).should('exist');

              goNextState();
              cy.findByText(/back/i, { selector: 'button' }).click();
            } else {
              throw new Error(`Unexpected state in introPageB: ${nextState}`);
            }
          });
        });
      },
      [summaryPageA]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'VERIFY_SUMMARY_A_NO_ITEMS') {
              cy.get('va-radio[name="root_view:hasEmployment"]')
                .shadow()
                .find('h3')
                .should(
                  'contain',
                  'Variation A: Do you have any employment, including self-employment for the last 5 years to report?',
                );

              cy.get('va-card').should('have.length', 0);

              cy.selectYesNoVaRadioOption('root_view:hasEmployment', true);
              goNextState();
              cy.findByText(/continue/i, { selector: 'button' }).click();
            } else if (nextState === 'VERIFY_SUMMARY_A_WITH_ITEMS') {
              cy.get('va-radio[name="root_view:hasEmployment"]')
                .shadow()
                .find('h4')
                .should(
                  'contain',
                  'Variation A: Do you have another employer to report?',
                );

              cy.get('va-card').should('have.length', 1);

              goNextState();
              cy.findByText(/back/i, { selector: 'button' }).click();
            } else {
              throw new Error(`Unexpected state in summaryPageA: ${nextState}`);
            }
          });
        });
      },
      [summaryPageB]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'VERIFY_SUMMARY_B_NO_ITEMS') {
              cy.get('va-radio[name="root_view:hasEmployment"]')
                .shadow()
                .find('h4')
                .should(
                  'contain',
                  'Variation B: Would you like to add another employer?',
                );

              cy.get('va-card').should('have.length', 1);

              cy.get(
                'va-card[name="employer_0"] [data-action="remove"]',
              ).click();
              cy.get('va-modal[status="warning"]')
                .shadow()
                .get('.va-modal-alert-body va-button')
                .first()
                .click();

              cy.selectYesNoVaRadioOption('root_view:hasEmployment', false);
              goNextState();
              cy.findByText(/continue/i, { selector: 'button' }).click();
            } else if (nextState === 'VERIFY_SUMMARY_B_WITH_ITEMS') {
              cy.get('va-radio[name="root_view:hasEmployment"]')
                .shadow()
                .find('h3')
                .should(
                  'contain',
                  'Variation B: Have you been employed or self-employed in the past 5 years?',
                );

              cy.get('va-card').should('have.length', 0);

              cy.selectYesNoVaRadioOption('root_view:hasEmployment', false);
              goNextState();
              cy.findByText(/continue/i, { selector: 'button' }).click();
            } else {
              throw new Error(`Unexpected state in summaryPageB: ${nextState}`);
            }
          });
        });
      },
      [itemPage]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            if (nextState === 'ADD_ITEM_A' || nextState === 'ADD_ITEM_B') {
              cy.fillPage();
              goNextState();
              cy.findByText(/continue/i, { selector: 'button' }).click();
            } else {
              throw new Error(`Unexpected state in itemPage: ${nextState}`);
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
