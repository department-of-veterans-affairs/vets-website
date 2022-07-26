import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience', () => {
  describe('happy path', () => {
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
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 1,
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('happy path', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Validate');
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Contact-info');
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Emergency-contact');
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Next-of-kin');
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(3);
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Appointments');

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Confirmation');
    });
  });
});
