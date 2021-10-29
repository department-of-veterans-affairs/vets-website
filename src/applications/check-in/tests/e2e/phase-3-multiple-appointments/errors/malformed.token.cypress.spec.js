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
  it('C5724 - Token is not valid', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=MALFORMED_TOKEN';
    cy.visit(featureRoute);
    cy.get('h1').contains('We couldn’t check you in');
  });
});
