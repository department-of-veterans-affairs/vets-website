import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import TravelPages from '../../../../tests/e2e/pages/TravelPages';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('travel question display', () => {
    beforeEach(() => {
      const appointments = [{ startTime: '2021-08-19T03:00:00' }];
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withTravelPay();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeDemographicsPatch.withSuccess();
      initializeCheckInDataGet.withSuccess({
        appointments,
      });
      initializeCheckInDataPost.withSuccess();
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded(
        'Check-In Is this your current next of kin information?',
      );
      NextOfKin.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('renders the travel question page with content', () => {
      TravelPages.validatePageLoaded();
      TravelPages.validateContent();
      TravelPages.validateHelpSection();
      TravelPages.validateBackButton('travel-pay');
      cy.injectAxeThenAxeCheck();
    });
  });
});
