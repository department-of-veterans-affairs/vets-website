import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import SeeStaff from '../pages/SeeStaff';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Arrived from '../pages/Arrived';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience', () => {
  describe('See Staff display', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptCheckIn();
      Arrived.validateArrivedPage();
      Arrived.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });

    it('Navigation routing hitting no on every page', () => {
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();
      SeeStaff.selectBackButton();

      Demographics.validatePageLoaded();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();
      SeeStaff.selectBackButton();

      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      NextOfKin.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();
      SeeStaff.selectBackButton();

      NextOfKin.validatePage.dayOf();
    });
  });
});
