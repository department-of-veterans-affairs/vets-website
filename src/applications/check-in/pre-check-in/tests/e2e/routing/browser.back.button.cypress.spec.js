import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import NextOfKin from '../../../../tests/e2e/pages/NextOfKin';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import Confirmation from '../pages/Confirmation';

describe('Pre-Check In Experience ', () => {
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

    initializePreCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Browser back button still works with routing', () => {
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

    cy.go('back');
    cy.go('back');
    Demographics.validatePageLoaded();
    Demographics.attemptToGoToNextPage();
    EmergencyContact.validatePageLoaded();
    EmergencyContact.attemptToGoToNextPage();
    NextOfKin.validatePageLoaded();
    NextOfKin.attemptToGoToNextPage();
    Confirmation.validatePageLoaded();
  });
});
