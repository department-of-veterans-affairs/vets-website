import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Appointments from '../pages/Appointments';
import Arrived from '../pages/Arrived';

import sharedData from '../../../../api/local-mock-api/mocks/v2/shared';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

// TODO: remove commment once this is not disallowed

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
    beforeEach(() => {
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
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Veterans may refresh their appointments', () => {
      Appointments.validateAppointmentLength(3);
      Appointments.validateAppointmentTime(3, '6:00 p.m.');
      Appointments.validateUpdateDate();
      cy.injectAxeThenAxeCheck();
      cy.scrollTo('bottom')
        .window()
        .its('scrollY')
        .should('not.equal', 0);
      Appointments.refreshAppointments();
      cy.window()
        .its('scrollY')
        .should('equal', 0);
      cy.injectAxeThenAxeCheck();
      Appointments.validateAppointmentTime(3, '5:00 p.m.');
    });
  });
});
