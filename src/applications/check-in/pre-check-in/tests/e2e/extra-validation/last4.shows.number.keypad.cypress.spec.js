import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('shows the numeric keypad on mobile devices', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();

      cy.get('[label="Last 4 digits of your Social Security number"]').should(
        'have.attr',
        'inputmode',
        'numeric',
      );
    });
  });
});
