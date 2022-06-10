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
    it('only allows typing 4 characters', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePage.preCheckIn();
      cy.injectAxeThenAxeCheck();

      ValidateVeteran.typeLast4('12345');

      ValidateVeteran.getLast4Input()
        .should('be.visible')
        .and('have.value', '1234');

      cy.get('[label="Last 4 digits of your Social Security number"]')
        .shadow()
        .find('small')
        .should('be.visible')
        .and('have.text', '(Max. 4 characters)');
    });
  });
});
