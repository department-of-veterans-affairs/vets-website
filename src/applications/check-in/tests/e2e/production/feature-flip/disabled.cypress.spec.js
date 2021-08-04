import { createFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', createFeatureToggles(false));
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('feature is disabled', () => {
    const featureRoute =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
    cy.visit(featureRoute);
    cy.url().should('not.match', /check-in/);
  });
});
