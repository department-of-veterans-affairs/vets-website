import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../pages/Error';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('No Token present', () => {
    cy.visit(`/health-care/appointment-pre-check-in`);
    Error.validatePageLoadedGeneric();
    cy.injectAxeThenAxeCheck();
  });
});
