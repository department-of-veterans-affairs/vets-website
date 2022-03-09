import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Appointments from '../pages/Appointments';
import Confirmation from '../pages/Confirmation';

describe('Check In Experience', () => {
  describe('check-in with demographics confirmation', () => {
    beforeEach(() => {
      const patchSpy = cy.spy().as('demographicsPatchSuccess');
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 2,
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withSuccess(patchSpy);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('happy path with confirmed demographics', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      cy.get('@demographicsPatchSuccess').then(spy => {
        expect(spy).to.be.calledOnce;
      });

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(3);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      // call should not occur a second time if first call was successful
      cy.get('@demographicsPatchSuccess').then(spy => {
        expect(spy).to.be.calledOnce;
      });
    });
  });
  describe('check-in demographics confirmation - With API error', () => {
    beforeEach(() => {
      const patchSpy = cy.spy().as('demographicsPatchFailure');
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeCheckInDataPost,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withDayOfDemographicsFlagsEnabled();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 2,
      });
      initializeCheckInDataPost.withSuccess();
      initializeDemographicsPatch.withFailure(400, patchSpy);
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('check-in confirmation with demographics API error', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage();

      EmergencyContact.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      EmergencyContact.attemptToGoToNextPage();

      NextOfKin.validatePage.dayOf();
      cy.injectAxeThenAxeCheck();
      NextOfKin.attemptToGoToNextPage();

      Appointments.validatePageLoaded();

      Appointments.attemptCheckIn(2);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      cy.get('@demographicsPatchFailure').then(spy => {
        expect(spy).to.be.calledOnce;
      });

      Confirmation.attemptGoBackToAppointments();
      Appointments.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      Appointments.attemptCheckIn(3);
      Confirmation.validatePageLoaded();
      cy.injectAxeThenAxeCheck();

      // Call should be attempted a second time since first was not successful
      cy.get('@demographicsPatchFailure').then(spy => {
        expect(spy).to.be.calledTwice;
      });
    });
  });
});
