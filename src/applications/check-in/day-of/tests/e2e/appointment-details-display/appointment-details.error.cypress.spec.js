/* eslint-disable cypress/no-unnecessary-waiting */
import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';
import Error from '../pages/Error';
import Arrived from '../pages/Arrived';

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
      Appointments.attemptCheckIn(1);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Error page content loads on expired UUID', () => {
      Confirmation.validatePageLoaded();
      // Cypress turfs out sometimes if it tries to click to soon. This should hopefully keep this from becoming flaky.
      cy.wait(1000);
      ApiInitializer.initializeCheckInDataGet.withUuidNotFound();
      Confirmation.clickDetails();
      Error.validatePageLoaded('uuid-not-found');
      cy.injectAxeThenAxeCheck();
    });
  });
});
