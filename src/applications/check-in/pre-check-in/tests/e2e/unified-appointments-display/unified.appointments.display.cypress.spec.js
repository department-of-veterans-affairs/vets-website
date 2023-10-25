import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import AppointmentDetails from '../../../../tests/e2e/pages/AppointmentDetails';

describe('Check In Experience -- ', () => {
  describe('Appointment display -- ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
        initializeUpcomingAppointmentsDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializePreCheckInDataGet.withSuccess();
      initializeUpcomingAppointmentsDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Upcoming appointments are displayed in a sorted manner', () => {
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
      AppointmentsPage.validateUpcomingAppointmentsList();
      cy.injectAxeThenAxeCheck();
    });

    it('What to do next displays a pre check in card for valid appointments', () => {
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validateWhatNextHeader();
      AppointmentsPage.validateWhatNextCardTitle.preCheckIn();
      AppointmentsPage.validateWhatNextCardDetailsLink();
      AppointmentsPage.validateWhatNextCardActionLink.preCheckIn();
      cy.injectAxeThenAxeCheck();
    });

    // TODO: Complete this test with pre check in api call flow ticket #67417
    it.skip('What to do next displays a success alert when demographics are up to date', () => {
      ApiInitializer.initializePreCheckInDataGet.withSuccess({
        uuid: '4d523464-c450-49dc-9a18-c04b3f1642ee',
      });
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      cy.injectAxeThenAxeCheck();
    });

    it('should navigate to appointment details', () => {
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.clickDetails();
      AppointmentDetails.validatePageLoadedInPerson();
      cy.injectAxeThenAxeCheck();
    });
  });
});
