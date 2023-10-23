import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import AppointmentDetails from '../../../../tests/e2e/pages/AppointmentDetails';

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
    beforeEach(() => {
      const singleAppointment = [{ startTime: '2021-08-19T15:00:00' }];
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeUpcomingAppointmentsDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({ appointments: singleAppointment });
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Upcoming appointments are displayed in a sorted manner', () => {
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.validateUpcomingAppointmentsList();
      cy.injectAxeThenAxeCheck();
    });
    it('What to do next displays a check in card for valid appointments', () => {
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validateWhatNextHeader();
      AppointmentsPage.validateWhatNextCardTitle.dayOf();
      AppointmentsPage.validateWhatNextCardDetailsLink();
      AppointmentsPage.validateWhatNextCardActionLink.dayOf();
      cy.injectAxeThenAxeCheck();
    });
    it('What to do next displays multiple check in cards ordered by ascending dateTime for valid appointments', () => {
      const multipleAppointments = [
        { startTime: '2021-08-19T17:00:00' },
        {
          startTime: '2021-08-19T16:00:00',
          eligibility: 'INELIGIBLE',
        },
        { startTime: '2021-08-19T15:00:00' },
      ];
      ApiInitializer.initializeCheckInDataGet.withSuccess({
        appointments: multipleAppointments,
      });
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validateMultipleCards(2);
      AppointmentsPage.validateCardOrder();
      cy.injectAxeThenAxeCheck();
    });
    it('should navigate to appointment details', () => {
      const multipleAppointments = [
        { startTime: '2021-08-19T17:00:00' },
        {
          startTime: '2021-08-19T16:00:00',
          eligibility: 'INELIGIBLE',
        },
        { startTime: '2021-08-19T15:00:00' },
      ];
      ApiInitializer.initializeCheckInDataGet.withSuccess({
        appointments: multipleAppointments,
      });
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.clickDetails(0);
      AppointmentDetails.validatePageLoadedInPerson();
      cy.injectAxeThenAxeCheck();
    });
  });
});
