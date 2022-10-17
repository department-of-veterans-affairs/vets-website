import '../../../../tests/e2e/commands';
import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Pre-Check In Experience', () => {
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
  it('Feature is enabled', () => {
    cy.visitPreCheckInWithUUID();
    ValidateVeteran.validatePage.preCheckIn();
    cy.injectAxeThenAxeCheck();
  });
});
