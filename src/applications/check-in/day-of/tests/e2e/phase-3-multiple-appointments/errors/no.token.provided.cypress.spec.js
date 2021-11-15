import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles());
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5726 - No token provided', () => {
    const featureRoute = '/health-care/appointment-check-in/';
    cy.visit(featureRoute);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
