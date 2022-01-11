import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import EmergencyContact from '../../../../tests/e2e/pages/EmergencyContact';

describe('Pre-Check In Experience ', () => {
  let apiData = {};
  beforeEach(function() {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataGet,
      initializePreCheckInDataPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
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
  it('Emergency Contact Enabled', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePageLoaded();
    ValidateVeteran.validateVeteran();
    cy.injectAxe();
    cy.axeCheck();

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
  });
});
