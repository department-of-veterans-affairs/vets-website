import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Appointments from '../pages/Appointments';

describe('Check In Experience -- ', () => {
  describe('update skip path -- ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
      } = ApiInitializer;
      const now = Date.now();
      const today = new Date(now);
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 1,
        demographicsNeedsUpdate: false,
        demographicsConfirmedAt: today.toISOString(),
        nextOfKinNeedsUpdate: true,
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: today.toISOString(),
      });
      initializeCheckInDataPost.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('update next of kin only path', () => {
      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
  });
});
