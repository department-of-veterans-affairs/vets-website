import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience -- ', () => {
  describe('Confirmation display -- ', () => {
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
      Demographics.attemptToGoToNextPage();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.attemptToGoToNextPage();
      Appointments.validatePageLoaded();
      Appointments.attemptCheckIn(2);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('confirm page display', () => {
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
    it('confirm page has BTSSS link', () => {
      Confirmation.validateBTSSSLink();
      cy.injectAxeThenAxeCheck();
    });
    it('confirm back button', () => {
      Confirmation.validateBackButton();
      cy.injectAxeThenAxeCheck();
    });
    it('refreshes appointment data when pressing the browser back button', () => {
      Confirmation.validatePageLoaded();
      cy.intercept(
        '/check_in/v2/patient_check_ins/*',
        cy.spy().as('apptRefresh'),
      );
      cy.go('back');
      cy.get('@apptRefresh')
        .its('callCount')
        .should('equal', 1);
      cy.injectAxeThenAxeCheck();
    });
  });
});
