import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Confirmation from '../pages/Confirmation';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Pre-Check In Experience', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();

    initializeSessionPost.withSuccess();
  });
  describe('Confirmation Pages', () => {
    beforeEach(() => {
      const {
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializePreCheckInDataGet.withSuccess();

      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Demographics.validatePageLoaded();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Confirmation page content loads', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validatePageContent();
      cy.injectAxeThenAxeCheck();
    });
    it('How can I update my information accordion is not visible', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validateConfirmNoUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('How can I update my information accordion is visible', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage('no');
      Confirmation.validateConfirmWithUpdates();
      cy.injectAxeThenAxeCheck();
    });
    it('Demographics needs update message is visible', () => {
      Demographics.attemptToGoToNextPage('no');
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validateDemographicsMessage();
      cy.injectAxeThenAxeCheck();
    });
    it('Emergency contact needs update message is visible', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage('no');
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage();
      Confirmation.validateEmergencyContactMessage();
      cy.injectAxeThenAxeCheck();
    });
    it('Next of kin contact needs update message is visible', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage();
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage('no');
      Confirmation.validateNextOfKinMessage();
      cy.injectAxeThenAxeCheck();
    });
    it('Emergency contact & next of kin contact needs update message is visible', () => {
      Demographics.attemptToGoToNextPage();
      EmergencyContact.validatePageLoaded();
      EmergencyContact.attemptToGoToNextPage('no');
      NextOfKin.validatePageLoaded();
      NextOfKin.attemptToGoToNextPage('no');
      Confirmation.validateEmergencyContactAndNextOfKinMessage();
      cy.injectAxeThenAxeCheck();
    });
  });
  describe('All demographics up to date', () => {
    beforeEach(() => {
      const {
        initializePreCheckInDataGet,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializePreCheckInDataGet.withAllDemographicsCurrent();

      initializePreCheckInDataPost.withSuccess();

      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
      Confirmation.validatePageContent();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('How can I update my information accordion is not visible when all pages are skipped', () => {
      Confirmation.validateConfirmNoUpdates();
      cy.injectAxeThenAxeCheck();
    });
  });
});
