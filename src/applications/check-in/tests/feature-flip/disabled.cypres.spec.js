import features from './mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    if (Cypress.env('CI')) this.skip();
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it.skip('feature is enabled', () => {
    const featureRoute = '/check-in/welcome';
    cy.visit(featureRoute);
    cy.url().should('not.match', /health-care/);
  });
});
