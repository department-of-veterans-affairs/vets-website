/* eslint-disable cypress/no-unnecessary-waiting */
import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Confirmation from '../pages/Confirmation';
import Arrived from '../pages/Arrived';
import AppointmentDetails from '../../../../tests/e2e/pages/AppointmentDetails';

// TODO: remove commment once this is not disallowed

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
          appointmentIen: '0001',
        },
      ];
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccessAndUpdate({ appointments });

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
      Appointments.attemptCheckIn(1);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Eligible appointment details page content loads', () => {
      Confirmation.validatePageLoaded();
      // Cypress turfs out sometimes if it tries to click to soon. This should hopefully keep this from becoming flaky.
      cy.wait(1000);
      Confirmation.clickDetails();
      AppointmentDetails.validatePageLoadedInPerson();
      AppointmentDetails.validateCheckedInMessage();
      cy.injectAxeThenAxeCheck();
      cy.createScreenshots('Day-of-check-in--Appointment-detail-checked-in');
    });
  });
});
