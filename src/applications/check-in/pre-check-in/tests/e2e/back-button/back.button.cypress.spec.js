import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Pre-Check In Experience ', () => {
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

    initializePreCheckInDataGet.withSuccess();

    initializePreCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Happy Path w/Emergency Contact', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();

    ValidateVeteran.attemptToGoToNextPage();

    // page: Appointments
    AppointmentsPage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    AppointmentsPage.attemptPreCheckIn();

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
    cy.get('[data-testid="back-button"]').click();

    EmergencyContact.validatePageLoaded();
  });
});
