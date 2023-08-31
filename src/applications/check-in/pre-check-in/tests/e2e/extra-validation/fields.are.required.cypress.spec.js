import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

// TODO: remove commment once this is not disallowed

describe('Pre-Check In Experience', () => {
  describe('Validation Page', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();

      initializePreCheckInDataGet.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed shows error messages', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();

      ValidateVeteran.attemptToGoToNextPage();
      cy.injectAxeThenAxeCheck();

      cy.get('[label="Your last name"]')
        .shadow()
        .find('#input-error-message')
        .contains('Please enter your last name.');

      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.attemptPreCheckIn();
    });
  });
});
