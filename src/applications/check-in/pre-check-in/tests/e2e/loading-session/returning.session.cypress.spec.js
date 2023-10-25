import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

// TODO: remove commment once this is not disallowed

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializePreCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulReturningSession();
    initializePreCheckInDataGet.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it.skip('an existing session redirects to introduction page', () => {
    cy.visitPreCheckInWithUUID();
    AppointmentsPage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
