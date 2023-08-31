import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import SeeStaff from '../pages/SeeStaff';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Arrived from '../pages/Arrived';

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
    it('see staff display with demographics message', () => {
      Demographics.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateMessage();
      cy.injectAxeThenAxeCheck();
    });
    it('see staff page has BTSSS link', () => {
      Demographics.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateBTSSSLink();
      cy.injectAxeThenAxeCheck();
    });
    it('back link goes back to previous page', () => {
      Demographics.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateBackButton();
      SeeStaff.selectBackButton();
      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('see staff display with next of kin message', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateMessage(
        'Our staff can help you update your next of kin information.',
      );
      cy.injectAxeThenAxeCheck();
    });
    it('see staff display with emergency contact message', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage('no');
      SeeStaff.validatePageLoaded();
      SeeStaff.validateMessage(
        'Our staff can help you update your emergency contact information.',
      );
      cy.injectAxeThenAxeCheck();
    });
  });
});
