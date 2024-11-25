import { normal, slow } from 'platform/testing/e2e/timeouts';

// visitor travel passing answers
const visitorPassTravel459 = {
  title: 'Visitor pass travel 459',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
    { id: 'question-travel-459', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

// visitor travel needs more screening
const visitorScreeningTravel459 = {
  title: 'Visitor needs more screening travel 459',
  questions: [
    { id: 'question-isStaff', value: 'no' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'yes' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure', value: 'no' },
    { id: 'question-travel-459', value: 'yes' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};

// staff travel passing
const staffPassTravel459 = {
  title: 'Staff pass travel 459',
  questions: [
    { id: 'question-isStaff', value: 'yes' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure-staff', value: 'no' },
    { id: 'question-travel-459', value: 'no' },
  ],
  result: {
    class: 'covid-screener-results-pass',
  },
};

// staff travel more screening
const staffScreeningTravel459 = {
  title: 'Staff needs more screening travel 459',
  questions: [
    { id: 'question-isStaff', value: 'yes' },
    { id: 'question-fever', value: 'no' },
    { id: 'question-cough', value: 'no' },
    { id: 'question-flu', value: 'no' },
    { id: 'question-congestion', value: 'no' },
    { id: 'question-exposure-staff', value: 'no' },
    { id: 'question-travel-459', value: 'yes' },
  ],
  result: {
    class: 'covid-screener-results-more-screening',
  },
};

Cypress.Commands.add('testQuestionScenario', ({ scenario, routeOption }) => {
  cy.reload();
  cy.get('body', { timeout: normal }).should('be.visible');
  scenario.questions.forEach(question => {
    cy.get(`div[id=${question.id}]`, { timeout: slow }).should('be.visible');
    cy.get(`div[id=${question.id}] > button[value=${question.value}]`).click();
  });
  cy.get(`div[class*=${scenario.result.class}]`, { timeout: slow }).should(
    'be.visible',
  );
  cy.log(`${scenario.title} on route: ${routeOption}`);
});

describe('Coronavirus Screener Alternate', () => {
  it('Gets the correct result for each alternate scenario', () => {
    // custom travel question /459
    cy.visit('/covid19screen/459');
    cy.get('body', { timeout: normal }).should('be.visible');
    cy.get('va-summary-box[id=question-isStaff]').should('be.visible');
    cy.get('div[class*=covid-screener-results-incomplete]').should(
      'be.visible',
    );
    cy.injectAxeThenAxeCheck();

    cy.testQuestionScenario({ scenario: visitorPassTravel459 });
    cy.testQuestionScenario({ scenario: visitorScreeningTravel459 });
    cy.testQuestionScenario({ scenario: staffPassTravel459 });
    cy.testQuestionScenario({ scenario: staffScreeningTravel459 });

    // custom travel question /459GH
    visitorPassTravel459.questions[6].id = 'question-travel-459GH';
    visitorScreeningTravel459.questions[6].id = 'question-travel-459GH';
    staffPassTravel459.questions[6].id = 'question-travel-459GH';
    staffScreeningTravel459.questions[6].id = 'question-travel-459GH';

    cy.visit('/covid19screen/459GH');
    cy.get('body', { timeout: normal }).should('be.visible');
    cy.get('va-summary-box[id=question-isStaff]').should('be.visible');
    cy.get('div[class*=covid-screener-results-incomplete]').should(
      'be.visible',
    );
    cy.axeCheck();

    cy.testQuestionScenario({ scenario: visitorPassTravel459 });
    cy.testQuestionScenario({ scenario: visitorScreeningTravel459 });
    cy.testQuestionScenario({ scenario: staffPassTravel459 });
    cy.testQuestionScenario({ scenario: staffScreeningTravel459 });

    // custom travel question case insensitive /459gh
    cy.visit('/covid19screen/459gh');
    cy.get('body', { timeout: normal }).should('be.visible');
    cy.get('va-summary-box[id=question-isStaff]').should('be.visible');
    cy.get('div[class*=covid-screener-results-incomplete]').should(
      'be.visible',
    );
    cy.axeCheck();

    cy.testQuestionScenario({ scenario: visitorPassTravel459 });
    cy.testQuestionScenario({ scenario: visitorScreeningTravel459 });
    cy.testQuestionScenario({ scenario: staffPassTravel459 });
    cy.testQuestionScenario({ scenario: staffScreeningTravel459 });
  });
});
