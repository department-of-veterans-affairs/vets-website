import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

let nextState;
function* stateSequence() {
  yield 'ADD_EVENT';
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
function addEvent() {
  // cy.url().should('include', 'add=true');
  cy.get('button.usa-button')
    .contains('Add an event')
    .click();
  // cy.fillPage();
  // cy.axeCheck();
  // cy.findByText(/continue/i, { selector: 'button' }).click();
}

const prefillData = {
  syncModern0781Flow: true,
};

const existingPageHooks = pageHooks(cy, { prefillData });

const eventsPageHooks = {
  'mental-health-form-0781/events-summary': ({ afterHook }) => {
    afterHook(() => {
      cy.get('button.usa-button')
        .contains('Add an event')
        .should('exist');

      goNextState();
      if (nextState === 'ADD_EVENT') {
        cy.get('button.usa-button')
          .contains('Add an event')
          .should('exist');
        cy.get('va-card').should('have.length', 0);
        addEvent();
        goNextState();
      } else if (nextState === 'FINISH') {
        cy.get('button.usa-button')
          .contains('Add an event')
          .should('exist');
        cy.get('va-card').should('have.length', 1);
        cy.findByText(/continue/i, { selector: 'button' }).click();
      } else {
        throw new Error(`Unexpected nextState: ${nextState}`);
      }
    });
  },
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-modern-0781-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: {
      ...existingPageHooks,
      ...eventsPageHooks,
    },

    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, { prefillData });
    },

    useWebComponentFields: true,

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
