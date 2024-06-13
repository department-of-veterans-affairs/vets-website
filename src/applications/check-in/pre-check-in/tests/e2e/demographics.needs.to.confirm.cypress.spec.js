import '../../../tests/e2e/commands';

import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import AppointmentDetails from '../../../tests/e2e/pages/AppointmentDetails';
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
    });
    it('should complete pre-check-in with yes to all demographics questions', () => {
      cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
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
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
          demographicsUpToDate: true,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });

      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in for a phone appointment with yes to all demographics questions', () => {
      cy.visitPreCheckInWithUUID('258d753c-262a-4ab2-b618-64b645884daf');
      initializePreCheckInDataGet.withSuccess({
        uuid: '258d753c-262a-4ab2-b618-64b645884daf',
      });
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
          uuid: '258d753c-262a-4ab2-b618-64b645884daf',
          demographicsUpToDate: true,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });

      Confirmation.validatePageLoaded();
      Confirmation.validateAppointmentType('phone');
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in and only display and update relevant demographics', () => {
      cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
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
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
          demographicsUpToDate: true,
          checkInType: 'preCheckIn',
        });

      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to contact info', () => {
      cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
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
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
          demographicsUpToDate: false,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to Emergency Contact', () => {
      cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
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
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
          demographicsUpToDate: true,
          nextOfKinUpToDate: true,
          emergencyContactUpToDate: false,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to Next Of Kin', () => {
      cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
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
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
          demographicsUpToDate: true,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: true,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('should complete pre-check-in when answering no to all demographics questions', () => {
      cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
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
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
          demographicsUpToDate: false,
          nextOfKinUpToDate: false,
          emergencyContactUpToDate: false,
          checkInType: 'preCheckIn',
        });
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    describe('A patient who clicks details from appointments list page, then clicks to verify info from details and completes pre-check-in', () => {
      it('should proceed through the pre-check-in questions to complete the process', () => {
        cy.visitPreCheckInWithUUID('47fa6bad-62b4-440d-a4e1-50e7f7b92d27');
        initializePreCheckInDataGet.withSuccess({
          uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
        });
        ValidateVeteran.validateVeteran();
        ValidateVeteran.attemptToGoToNextPage();
        AppointmentsPage.validatePageLoaded();
        AppointmentsPage.clickDetails();
        AppointmentDetails.validatePageLoadedInPerson();
        AppointmentDetails.validateSubtitleInPerson();
        AppointmentDetails.validateWhen();
        AppointmentDetails.validateProvider();
        AppointmentDetails.validateWhere('in-person');
        AppointmentDetails.validateFacilityAddress(true);
        AppointmentDetails.validateDirectionsLink(true);
        AppointmentDetails.validatePhone();
        cy.injectAxeThenAxeCheck();
        AppointmentDetails.clickReview();
        Demographics.validatePageLoaded();
        Demographics.attemptToGoToNextPage();
        EmergencyContact.validatePageLoaded();
        EmergencyContact.attemptToGoToNextPage();
        NextOfKin.validatePageLoaded();
        NextOfKin.attemptToGoToNextPage();
        cy.wait('@post-pre_check_ins-success')
          .its('request.body.preCheckIn')
          .should('deep.equal', {
            uuid: '47fa6bad-62b4-440d-a4e1-50e7f7b92d27',
            demographicsUpToDate: true,
            nextOfKinUpToDate: true,
            emergencyContactUpToDate: true,
            checkInType: 'preCheckIn',
          });
        Confirmation.validatePageLoaded();
      });
    });
  });
});
