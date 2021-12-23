import '../support/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience -- ', () => {
  describe('happy path -- ', () => {
    beforeEach(function() {
      cy.getSingleAppointment();
      cy.successfulCheckin();
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('happy path', () => {
      cy.visitWithUUID();
      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxe();
      cy.axeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      cy.injectAxe();
      cy.axeCheck();
      Demographics.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      cy.injectAxe();
      cy.axeCheck();
      NextOfKin.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      cy.injectAxe();
      cy.axeCheck();
      EmergencyContact.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(3);
      cy.injectAxe();
      cy.axeCheck();
      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
