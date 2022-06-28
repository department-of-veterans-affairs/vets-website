import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';
import checkInData from '../../../../api/local-mock-api/mocks/v2/check-in-data';

describe('Check In Experience', () => {
  describe('everything path', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withAllFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataPost.withSuccess();

      const rv1 = checkInData.get.createMultipleAppointments();
      const earliest = checkInData.get.createAppointment();
      earliest.startTime = '2021-08-19T03:00:00';
      const midday = checkInData.get.createAppointment();
      midday.startTime = '2021-08-19T13:00:00';
      const latest = checkInData.get.createAppointment();
      latest.startTime = '2027-08-19T18:00:00';
      rv1.payload.appointments = [latest, earliest, midday];

      const rv2 = checkInData.get.createMultipleAppointments();
      const newLatest = checkInData.get.createAppointment();
      newLatest.startTime = '2027-08-19T17:00:00';
      rv2.payload.appointments = [newLatest, earliest, midday];
      const responses = [rv1, rv2];

      cy.intercept(
        {
          method: 'GET',
          url: '/check_in/v2/patient_check_ins/*',
        },
        req => {
          req.reply(responses.shift());
        },
      ).as('testid');
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('everything Happy path', () => {
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePageLoaded(
        'Is this your current next of kin information?',
      );
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(3);
      Appointments.validateAppointmentTime(3, '6:00 p.m.');
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(3);
      // Validate that appointments are refreshed.
      Appointments.validateAppointmentTime(3, '5:00 p.m.');
      cy.injectAxeThenAxeCheck();
    });
  });
});
