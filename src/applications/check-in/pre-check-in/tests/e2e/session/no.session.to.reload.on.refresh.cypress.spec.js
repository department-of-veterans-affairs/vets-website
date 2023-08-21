import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';

import Error from '../pages/Error';

describe('Pre Check In Experience', () => {
  describe('session', () => {
    beforeEach(() => {
      const { initializeFeatureToggle } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });

    it('Should show error page since there is no data to load locally', () => {
      const featureRoute = '/health-care/appointment-pre-check-in/appointments';
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
      cy.visit(featureRoute);
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
