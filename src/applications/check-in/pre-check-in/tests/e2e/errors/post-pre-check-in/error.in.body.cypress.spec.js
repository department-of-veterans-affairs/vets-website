import '../../../../../tests/e2e/commands';

import ApiInitializer from '../../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../../pages/Introduction';
import Demographics from '../../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../../tests/e2e/pages/EmergencyContact';
import Error from '../../pages/Error';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('POST /check_in/v2/pre_check_ins/', () => {
      let apiData = {};
      beforeEach(() => {
        const {
          initializeFeatureToggle,
          initializeSessionGet,
          initializeSessionPost,
          initializePreCheckInDataGet,
          initializePreCheckInDataPost,
          initializeDemographicsPatch,
        } = ApiInitializer;
        initializeFeatureToggle.withCurrentFeatures();
        initializeDemographicsPatch.withSuccess();
        initializeSessionGet.withSuccessfulNewSession();

        initializeSessionPost.withSuccess();

        apiData = initializePreCheckInDataGet.withSuccess();

        initializePreCheckInDataPost.withFailure(200);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('error in the body', () => {
        cy.visitPreCheckInWithUUID();
        // page: Validate
        ValidateVeteran.validatePage.preCheckIn();
        ValidateVeteran.validateVeteran();
        cy.injectAxeThenAxeCheck();

        ValidateVeteran.attemptToGoToNextPage();

        // page: Introduction
        Introduction.validatePageLoaded();
        Introduction.countAppointmentList(apiData.payload.appointments.length);
        cy.injectAxeThenAxeCheck();
        Introduction.attemptToGoToNextPage();

        // page: Demographics
        Demographics.validatePageLoaded();
        cy.injectAxeThenAxeCheck();
        Demographics.attemptToGoToNextPage();

        EmergencyContact.validatePageLoaded();
        cy.injectAxeThenAxeCheck();
        EmergencyContact.attemptToGoToNextPage();

        // page: Next of Kin
        NextOfKin.validatePageLoaded();
        cy.injectAxeThenAxeCheck();
        NextOfKin.attemptToGoToNextPage();

        // page: Confirmation
        Error.validateAPIErrorPageLoaded();
        cy.injectAxeThenAxeCheck();
        cy.createScreenshots('Pre-check-in--Error-with-appointment-data');
      });
    });
  });
});
