import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5726 - No token provided', () => {
    const featureRoute = '/health-care/appointment-check-in/';
    cy.visit(featureRoute);
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
