import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Confirmation from '../../pages/Confirmation';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();

    initializeSessionPost.withSuccess();

    initializePreCheckInDataGet.withAlreadyCompleted();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Render Error is caught', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePageLoaded();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.attemptToGoToNextPage();

    // Expired UUID should navigate to an error
    Confirmation.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
