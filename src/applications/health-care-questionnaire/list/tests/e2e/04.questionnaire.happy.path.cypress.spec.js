import basicUser from './fixtures/users/user-basic.json';

import featureToggles from './fixtures/mocks/feature-toggles.enabled.json';

describe('health care questionnaire -- ', () => {
  beforeEach(() => {
    cy.login(basicUser);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
  });
  it('happy path', () => {
    cy.visit('/health-care/health-questionnaires/questionnaires/');
    cy.get('h1').contains('Your health questionnaires');
    cy.get(
      '[data-request-id="195bc02c0518870fc6b1e302cfc326b61"] > .usa-button',
    ).click();
    cy.get('h1').contains('Answer primary care questionnaire');
    cy.get('.va-button').click({ waitForAnimations: true });
    cy.get('[data-testid=fullName]').contains('Calvin C Fletcher');
    cy.get('#2-continueButton').click();
    cy.get('.reason-for-visit').contains('Routine or follow-up visit');
    cy.get('#root_reasonForVisitDescription')
      .invoke('val')
      .then(text => {
        expect(text).to.equal('testing reason for visit field availability');
      });
    cy.get('button#2-continueButton.usa-button-primary').click();
    cy.get('#nav-form-header').contains('Review');
    cy.get('button#6-continueButton.usa-button-primary.null').click();
    cy.get('.usa-alert-heading').contains(
      'Your information has been sent to your provider',
    );
  });
});
