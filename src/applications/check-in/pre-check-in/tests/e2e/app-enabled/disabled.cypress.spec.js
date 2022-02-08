import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';

import '../../../../tests/e2e/commands';

describe('Pre-Check In Experience', () => {
  beforeEach(() => {
    ApiInitializer.initializeFeatureToggle.withAppsDisabled();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Feature is disabled', () => {
    cy.visitPreCheckInWithUUID();
    cy.url().should('not.match', /check-in/);
    cy.injectAxeThenAxeCheck();
  });
});
