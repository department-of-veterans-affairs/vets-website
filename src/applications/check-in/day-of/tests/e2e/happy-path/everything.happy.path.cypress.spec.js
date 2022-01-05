import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import UpdateInformation from '../pages/UpdateInformation';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience', () => {
  describe('everything path', () => {
    beforeEach(function() {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withAllFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 1,
      });
      initializeCheckInDataPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('everything Happy path', () => {
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Demographics.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      cy.injectAxeThenAxeCheck();

      NextOfKin.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      EmergencyContact.attemptToGoToNextPage();
      UpdateInformation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      UpdateInformation.attemptToGoToNextPage('no');
      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(3);
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
