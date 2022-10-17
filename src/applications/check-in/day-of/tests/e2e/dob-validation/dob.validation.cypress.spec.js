import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';

describe('Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeCheckInDataPost,
      initializeCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withLorotaSecurityUpdate();
    initializeSessionGet.withSuccessfulNewSession();
    initializeCheckInDataGet.withSuccess({
      numberOfCheckInAbledAppointments: 1,
    });
    initializeSessionPost.withSuccess();

    initializeCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Validate with DOB', () => {
    cy.visitWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.dayOf();
    ValidateVeteran.validateVeteranDob();
    cy.injectAxeThenAxeCheck();
    cy.createScreenshots('Day-of-check-in--Validate-with-DOB');
    ValidateVeteran.attemptToGoToNextPage();
    // page: Demographics
    Demographics.validatePageLoaded();
  });
  it('only allows submits with valid date', () => {
    cy.visitWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.dayOf();
    ValidateVeteran.validateVeteranDobInvalidYear();
    ValidateVeteran.attemptToGoToNextPage();
    ValidateVeteran.getDobError();
    cy.injectAxeThenAxeCheck();
  });
  it('only allows submits with valid date on enter', () => {
    cy.visitWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.dayOf();
    ValidateVeteran.validateVeteranDobInvalidYear();
    ValidateVeteran.attemptToGoToNextPageWithEnterKey();
    ValidateVeteran.getDobError();
    cy.injectAxeThenAxeCheck();
  });
  it('Will submit after correcting errors', () => {
    cy.visitWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.dayOf();
    ValidateVeteran.validateVeteranDobInvalidYear();
    ValidateVeteran.attemptToGoToNextPageWithEnterKey();
    ValidateVeteran.validateVeteranDob();
    ValidateVeteran.attemptToGoToNextPageWithEnterKey();
    Demographics.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
