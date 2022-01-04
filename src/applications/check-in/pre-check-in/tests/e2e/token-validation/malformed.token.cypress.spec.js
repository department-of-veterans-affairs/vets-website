import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../../../../tests/e2e/pages/Error';

describe('Pre-Check In Experience ', () => {
  beforeEach(function() {
    const { initializeFeatureToggle } = ApiInitializer;
    initializeFeatureToggle.withoutEmergencyContact();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('malformed token present', () => {
    cy.visitPreCheckInWithUUID('not-a-uuid');
    Error.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
