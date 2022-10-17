import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';

describe('Check In Experience', () => {
  describe('extra validation', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
      ValidateVeteran.attemptToGoToNextPage();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed shows error messages', () => {
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validatePage.dayOf();

      ValidateVeteran.attemptToGoToNextPage();
      cy.injectAxeThenAxeCheck();

      cy.get('[label="Your last name"]')
        .shadow()
        .find('#error-message')
        .contains('Please enter your last name.');

      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('#error-message')
        .contains(
          'Please enter the last 4 digits of your Social Security number',
        );

      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
  });
});
