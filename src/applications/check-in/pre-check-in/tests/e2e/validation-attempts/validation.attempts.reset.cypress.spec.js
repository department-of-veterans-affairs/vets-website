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
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializePreCheckInDataGet.withSuccess();

    initializeSessionPost.withValidation();

    initializePreCheckInDataPost.withSuccess();
  });
  beforeEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visitPreCheckInWithUUID();
    ValidateVeteran.validatePage.preCheckIn();
    ValidateVeteran.validateVeteran('Smit', '1234');
    ValidateVeteran.attemptToGoToNextPage();
  });
  it('Reset with successful login', () => {
    cy.injectAxeThenAxeCheck();
    cy.window().then(window => {
      const { sessionStorage } = window;
      expect(
        sessionStorage.getItem('health.care.pre.check.in.validate.attempts'),
      ).to.eq('1');
    });
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    Introduction.validatePageLoaded();
    cy.window().then(window => {
      const { sessionStorage } = window;
      expect(
        sessionStorage.getItem('health.care.pre.check.in.validate.attempts'),
      ).to.be.null;
    });
  });
  it('Reset with new UUID', () => {
    cy.injectAxeThenAxeCheck();
    cy.window().then(window => {
      const { sessionStorage } = window;
      expect(
        sessionStorage.getItem('health.care.pre.check.in.validate.attempts'),
      ).to.eq('1');
    });
    cy.visitPreCheckInWithUUID('25165847-2c16-4c8b-8790-5de37a7f427f');
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.validatePage.preCheckIn();
    cy.window().then(window => {
      const { sessionStorage } = window;
      expect(
        sessionStorage.getItem('health.care.pre.check.in.validate.attempts'),
      ).to.be.null;
    });
  });
  it('Persists with same UUID', () => {
    cy.injectAxeThenAxeCheck();
    cy.window().then(window => {
      const { sessionStorage } = window;
      expect(
        sessionStorage.getItem('health.care.pre.check.in.validate.attempts'),
      ).to.eq('1');
    });
    cy.visitPreCheckInWithUUID();
    cy.injectAxeThenAxeCheck();
    ValidateVeteran.validatePage.preCheckIn();
    cy.window().then(window => {
      const { sessionStorage } = window;
      expect(
        sessionStorage.getItem('health.care.pre.check.in.validate.attempts'),
      ).to.eq('1');
    });
  });
});
