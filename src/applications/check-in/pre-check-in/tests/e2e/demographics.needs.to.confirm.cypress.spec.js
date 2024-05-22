import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import Confirmation from './pages/Confirmation';

const dateFns = require('date-fns');

describe('Check In Experience | Pre-Check-In |', () => {
  const {
    initializeFeatureToggle,
    initializeSessionGet,
    initializeSessionPost,
    initializeUpcomingAppointmentsDataGet,
    initializePreCheckInDataGet,
    initializePreCheckInDataPost,
    initializeDemographicsPatch,
  } = ApiInitializer;
  describe('Patient who needs to confirm demographics', () => {
    beforeEach(() => {
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializePreCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      cy.visitPreCheckInWithUUID();
    });
    it('should complete pre-check-in if with yes to all demographics questions', () => {
      initializePreCheckInDataGet.withSuccess();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      cy.injectAxeThenAxeCheck();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          demographicsUpToDate: true,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });

      Confirmation.validatePageLoaded();
      Confirmation.validateConfirmNoUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in and only display and update relevant demographics', () => {
      initializePreCheckInDataGet.withSuccess({
        nextOfKinNeedsUpdate: false,
        nextOfKinConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
        emergencyContactNeedsUpdate: false,
        emergencyContactConfirmedAt: dateFns.format(
          new Date(),
          "yyyy-LL-dd'T'HH:mm:ss",
        ),
      });
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('yes');

      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          demographicsUpToDate: true,
          checkInType: 'preCheckIn',
        });

      Confirmation.validatePageLoaded();
      Confirmation.validateConfirmNoUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to contact info', () => {
      initializePreCheckInDataGet.withSuccess();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          demographicsUpToDate: false,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      Confirmation.validateConfirmWithUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to Emergency Contact', () => {
      initializePreCheckInDataGet.withSuccess();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage('no');

      NextOfKin.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          demographicsUpToDate: true,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: false,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      Confirmation.validateConfirmWithUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to Next Of Kin', () => {
      initializePreCheckInDataGet.withSuccess();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage('no');

      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          demographicsUpToDate: true,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      Confirmation.validateConfirmWithUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to all demographics questions', () => {
      initializePreCheckInDataGet.withSuccess();
      ValidateVeteran.validateVeteran();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.attemptToGoToNextPage();

      AppointmentsPage.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      AppointmentsPage.attemptCheckIn();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage('no');

      NextOfKin.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage('no');

      cy.wait('@post-pre_check_ins-success')
        .its('request.body.preCheckIn')
        .should('deep.equal', {
          uuid: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
          demographicsUpToDate: false,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: false,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      Confirmation.validateConfirmWithUpdates();
      cy.injectAxeThenAxeCheck();
    });
  });
});
