import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

// TODO: remove commment once this is not disallowed

describe('Pre-Check In Experience', () => {
  describe('Demographics Page', () => {
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

      initializePreCheckInDataGet.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Demographics.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Displays each field', () => {
      Demographics.validateDemographicsFields();
      cy.injectAxeThenAxeCheck();
    });
    it('Displays correct demographic data', () => {
      Demographics.validateDemographicData();
      cy.injectAxeThenAxeCheck();
    });
  });
});
