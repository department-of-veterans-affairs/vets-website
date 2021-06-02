import features from './mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
  });
  it('feature is enabled', () => {
    const featureRoute = '/check-in/welcome';
    cy.visit(featureRoute);
    cy.url().should('not.match', /health-care/);
  });
});
