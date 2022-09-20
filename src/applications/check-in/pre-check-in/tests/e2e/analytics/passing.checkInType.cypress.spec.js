import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import Confirmation from '../pages/Confirmation';

describe('Pre-Check In Experience ', () => {
  describe('analytics', () => {
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
      initializeSessionGet.withSuccessfulNewSession(req => {
        expect(req.query.checkInType).to.equal('preCheckIn');
      });

      initializeSessionPost.withSuccess(req => {
        expect(req.body.session.checkInType).to.equal('preCheckIn');
      });

      apiData = initializePreCheckInDataGet.withSuccess({
        extraValidation: req => {
          expect(req.query.checkInType).to.equal('preCheckIn');
        },
      });

      initializePreCheckInDataPost.withSuccess(req => {
        expect(req.body.preCheckIn.checkInType).to.equal('preCheckIn');
      });
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Sending checkInType for pre-check-in App', () => {
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

      // page: Emergency Contact
      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      // page: Next of Kin
      NextOfKin.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      // page: Confirmation
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
