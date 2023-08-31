import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Confirmation from '../pages/Confirmation';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Pre Check In Experience', () => {
  describe('update skip path', () => {
    beforeEach(() => {
      const now = Date.now();
      const today = new Date(now);
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeDemographicsPatch.withSuccess();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess({
        demographicsNeedsUpdate: true,
        demographicsConfirmedAt: today.toISOString(),
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: today.toISOString(),
        emergencyContactNeedsUpdate: true,
        emergencyContactConfirmedAt: today.toISOString(),
      });
      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('update demographics, skip next of kin path, and update emergency contact', () => {
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      Confirmation.validatePageLoaded();

      // Confirm that we posted data to the pre-checkin complete endpoint.
      cy.wait('@post-pre_check_ins-success');
      cy.get('@post-pre_check_ins-success')
        .its('request.body.preCheckIn.demographicsUpToDate')
        .should('equal', true);
      cy.get('@post-pre_check_ins-success')
        .its('request.body.preCheckIn.emergencyContactUpToDate')
        .should('equal', true);
      cy.get('@post-pre_check_ins-success')
        .its('request.body.preCheckIn.nextOfKinUpToDate')
        .should('not.exist');
      cy.get('@post-pre_check_ins-success')
        .its('response.statusCode')
        .should('equal', 200);

      cy.injectAxeThenAxeCheck();
    });
  });
});
