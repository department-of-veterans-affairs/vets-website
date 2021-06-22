import features from '../mocks/enabled.json';

describe('Check In Experience -- happy path', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it.skip('needs to update information', () => {
    cy.visit('/check-in/some-token');
    cy.get('h1').contains('insurance');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="yes-button"]').click();
    cy.get('h1').contains('staff member');
    cy.injectAxe();
    cy.axeCheck();
  });
});
