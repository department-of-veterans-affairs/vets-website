import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Error from '../pages/Error';
import Confirmation from '../pages/Confirmation';
import Arrived from '../pages/Arrived';

describe('Check In Experience', () => {
  describe('reload pages', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      initializeCheckInDataGet.withFailure();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('demographics page', () => {
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('emergency contact page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('next of kin page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('appointments page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('confirmation page', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn();
      Confirmation.validatePageLoaded();
      cy.reload();
      Error.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
