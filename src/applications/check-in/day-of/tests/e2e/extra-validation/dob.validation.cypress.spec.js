import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializeCheckInDataPost,
      initializeCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeCheckInDataGet.withSuccess();
    initializeSessionPost.withSuccess();

    initializeCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
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
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPageWithEnterKey();
    AppointmentsPage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
  });
});
