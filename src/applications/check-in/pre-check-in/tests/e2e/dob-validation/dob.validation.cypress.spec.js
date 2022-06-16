import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';

describe('Pre-Check In Experience ', () => {
  beforeEach(() => {
    const {
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
      initializePreCheckInDataPost,
      initializePreCheckInDataGet,
    } = ApiInitializer;
    initializeFeatureToggle.withLorotaSecurityUpdate();
    initializeSessionGet.withSuccessfulNewSession();
    initializePreCheckInDataGet.withSuccess();

    initializeSessionPost.withSuccess();

    initializePreCheckInDataPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Validate with DOB', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteranDob();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.attemptToGoToNextPage();
    // page: Introduction
    Introduction.validatePageLoaded();
  });
  it('only allows current and past years', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteranDobInvalidYear();
    ValidateVeteran.attemptToGoToNextPage();
    ValidateVeteran.getDobError();
    cy.injectAxeThenAxeCheck();
  });
});
