import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import Confirmation from '../pages/Confirmation';
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
  it('Happy Path', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--Validate');
    ValidateVeteran.attemptToGoToNextPage();

    // page: Appointments
    AppointmentsPage.validatePageLoaded();
    AppointmentsPage.attemptPreCheckIn();

    // page: Demographics
    Demographics.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--Contact-info');
    Demographics.attemptToGoToNextPage();

    // page: Emergency Contact
    EmergencyContact.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--Emergency-contact');
    EmergencyContact.attemptToGoToNextPage();

    // page: Next of Kin
    NextOfKin.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--Next-of-kin');
    NextOfKin.attemptToGoToNextPage();

    // page: Confirmation
    Confirmation.validatePageLoaded();

    // Confirm that we posted the correct data to the pre-checkin complete endpoint.
    cy.wait('@post-pre_check_ins-success');
    cy.get('@post-pre_check_ins-success')
      .its('request.body.preCheckIn.demographicsUpToDate')
      .should('equal', true);
    cy.get('@post-pre_check_ins-success')
      .its('request.body.preCheckIn.emergencyContactUpToDate')
      .should('equal', true);
    cy.get('@post-pre_check_ins-success')
      .its('request.body.preCheckIn.nextOfKinUpToDate')
      .should('equal', true);
    cy.get('@post-pre_check_ins-success')
      .its('response.statusCode')
      .should('equal', 200);

    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Pre-check-in--Confirmation-answer-yes-to-all');
  });
});
