import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Pre-Check In Experience', () => {
  describe('validation page', () => {
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
    it('validation failed', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();

      cy.get('[label="Your last name"]')
        .should('have.attr', 'auto-correct', 'false')
        .should('have.attr', 'spell-check', 'false');
    });
  });
});
