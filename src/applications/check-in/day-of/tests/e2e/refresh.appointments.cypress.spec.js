import '../../../tests/e2e/commands';
import ApiInitializer from '../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../tests/e2e/pages/NextOfKin';
import AppointmentsPage from '../../../tests/e2e/pages/AppointmentsPage';
import Confirmation from './pages/Confirmation';
import Arrived from './pages/Arrived';

import sharedData from '../../../api/local-mock-api/mocks/v2/shared';

describe('Check In Experience | Day Of |', () => {
  describe('Patient who wants to refresh appointments ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeUpcomingAppointmentsDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withValidation();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      window.localStorage.setItem(
        'health.care.check-in.travel.pay.sent',
        JSON.stringify(new Date()),
      );
      const rv1 = sharedData.get.createAppointments();
      const earliest = sharedData.get.createAppointment();
      earliest.startTime = '2021-08-19T03:00:00';
      const midday = sharedData.get.createAppointment();
      midday.startTime = '2021-08-19T13:00:00';
      const latest = sharedData.get.createAppointment();
      latest.startTime = '2027-08-19T18:00:00';
      rv1.payload.appointments = [latest, earliest, midday];

      const rv2 = sharedData.get.createAppointments();
      const newLatest = sharedData.get.createAppointment();
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
    it('should be able to check-in after refresh', () => {
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validateAppointmentTime(3, '6:00 p.m.');
      AppointmentsPage.validateUpdateDate();
      AppointmentsPage.refreshAppointments();
      AppointmentsPage.validateAppointmentTime(3, '5:00 p.m.');
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePage.dayOf();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
