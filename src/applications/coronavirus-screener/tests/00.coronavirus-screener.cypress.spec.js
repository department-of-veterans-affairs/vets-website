import { normal, slow } from 'platform/testing/e2e/timeouts';
import {
  visitorPass,
  visitorScreening,
  staffPass,
  staffScreening,
  fullTestRouteOptions,
  routeOptions,
} from './question-scenario-helper';

Cypress.Commands.add('testQuestionScenario', ({ scenario, routeOption }) => {
  cy.reload();
  cy.get('body', { timeout: normal }).should('be.visible');
  scenario.questions.forEach(question => {
    cy.get(`va-summary-box[id=${question.id}]`, { timeout: slow }).should(
      'be.visible',
    );
    cy.get(
      `va-summary-box[id=${question.id}] > button[value=${question.value}]`,
    ).click();
  });
  cy.get(`div[class*=${scenario.result.class}]`, { timeout: slow }).should(
    'be.visible',
  );
  cy.log(`${scenario.title} on route: ${routeOption}`);
});

describe('Coronavirus Screener', () => {
  it('Gets the correct result for each scenario', () => {
    cy.visit('/covid19screen');
    cy.get('body').should('be.visible');
    cy.get('va-summary-box[id=question-isStaff]').should('be.visible');
    cy.get('div[class*=covid-screener-results-incomplete]').should(
      'be.visible',
    );
    cy.injectAxeThenAxeCheck();

    routeOptions.forEach(routeOption => {
      cy.visit(`/covid19screen${routeOption.route}`);
      cy.get('body').should('be.visible');
      cy.get('.covid-screener div[class*=vads-l-grid-container]').should(
        'contain',
        routeOption.expectedText,
      );
      cy.log(routeOption.title);
    });

    fullTestRouteOptions.forEach(routeOption => {
      cy.visit(`/covid19screen${routeOption}`);

      // visitor passing answers
      cy.testQuestionScenario({
        scenario: visitorPass,
        routeOption,
      });

      // visitor needs more screening
      cy.testQuestionScenario({
        scenario: visitorScreening,
        routeOption,
      });

      // staff passing answers
      cy.testQuestionScenario({
        scenario: staffPass,
        routeOption,
      });

      // staff needs more screening
      cy.testQuestionScenario({
        scenario: staffScreening,
        routeOption,
      });
    });
  });
});
