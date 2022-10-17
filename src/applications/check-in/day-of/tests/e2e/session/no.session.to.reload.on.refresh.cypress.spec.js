import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });

  it('C5751 - Should show error page since there is no data to load locally', () => {
    const featureRoute = '/health-care/appointment-check-in/details';
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visit(featureRoute);
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
