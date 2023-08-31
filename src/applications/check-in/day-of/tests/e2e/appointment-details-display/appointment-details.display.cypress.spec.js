import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';
import Arrived from '../pages/Arrived';
import AppointmentDetails from '../../../../tests/e2e/pages/AppointmentDetails';

describe('Check In Experience', () => {
  describe('Appointment details day-of', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
      } = ApiInitializer;
      const appointments = [
        {
          eligibility: 'ELIGIBLE',
        },
        {
          eligibility: 'INELIGIBLE_TOO_EARLY',
          startTime: '2021-08-19T14:00:00',
          checkInWindowStart: undefined,
        },
      ];
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({ appointments });

      initializeCheckInDataPost.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePage.dayOf();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Eligible appointment details page content loads', () => {
      Appointments.clickDetails(2);
      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere();
      AppointmentDetails.validateFacilityAddress(true);
      AppointmentDetails.validateDirectionsLink(true);
      AppointmentDetails.validatePhone();
      AppointmentDetails.validateCheckInButton();
      AppointmentDetails.validateReturnToAppointmentsPageButton();
      cy.createScreenshots(
        'Day-of-check-in--Appointment-detail-with-check-in-button',
      );
      cy.injectAxeThenAxeCheck();
    });
    it('Can check-in from details page for eligible appointment', () => {
      Appointments.clickDetails(2);
      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere();
      AppointmentDetails.validatePhone();
      AppointmentDetails.validateCheckInButton();
      AppointmentDetails.validateNoAppointmentMessage();
      AppointmentDetails.clickCheckInButton();
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('Ineligible appointment details page content loads', () => {
      Appointments.clickDetails();
      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateWhen();
      AppointmentDetails.validateProvider();
      AppointmentDetails.validateWhere();
      AppointmentDetails.validatePhone();
      AppointmentDetails.validateAppointmentMessage();
      AppointmentDetails.validateNoCheckInButton();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots(
        'Day-of-check-in--Appointment-detail-ineligible-apppointment',
      );
    });
  });
});
