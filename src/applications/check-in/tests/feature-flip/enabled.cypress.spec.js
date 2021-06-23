import features from '../mocks/enabled.json';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    cy.intercept('GET', '/v0/feature_toggles*', features);
    cy.intercept('GET', '/v0/patient_check_in/*', req => {
      req.reply({ id: 'abc-123', appointment: {} });
    });
  });
  it('feature is enabled', () => {
    const featureRoute = '/check-in/some-token';
    cy.visit(featureRoute);
    cy.get('h1').contains('insurance');
  });
});
