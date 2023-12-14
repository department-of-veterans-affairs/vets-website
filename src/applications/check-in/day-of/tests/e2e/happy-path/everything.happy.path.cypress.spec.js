import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';
import sharedData from '../../../../api/local-mock-api/mocks/v2/shared';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';

describe('Check In Experience', () => {
  describe('everything path', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
        initializeBtsssPost,
      } = ApiInitializer;
      initializeFeatureToggle.withAllFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeBtsssPost.withSuccess();

      const rv = sharedData.get.createAppointments();
      const appointment = sharedData.get.createAppointment();
      appointment.startTime = '2021-08-19T18:00:00';
      rv.payload.appointments = [appointment];

      const responses = [rv];

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
        'Check-In Is this your current next of kin information?',
      );
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      TravelPages.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('vehicle');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('address');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('mileage');
      cy.injectAxeThenAxeCheck();
      TravelPages.attemptToGoToNextPage();
      TravelPages.validatePageLoaded('review');
      cy.injectAxeThenAxeCheck();
      TravelPages.acceptTerms();
      TravelPages.attemptToGoToNextPage();

      Appointments.validatePageLoaded();
      Appointments.validateAppointmentLength(1);
      Appointments.validateAppointmentTime(1, '6:00 p.m.');
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(1);
      Confirmation.validatePageLoadedWithBtsssSubmission();
      cy.injectAxeThenAxeCheck();

      Confirmation.validatePageLoaded();
      cy.intercept(
        '/check_in/v2/patient_check_ins/*',
        cy.spy().as('apptRefresh'),
      );
      cy.go('back');
      cy.get('@apptRefresh')
        .its('callCount')
        .should('equal', 1);
      cy.injectAxeThenAxeCheck();
    });
  });
});
