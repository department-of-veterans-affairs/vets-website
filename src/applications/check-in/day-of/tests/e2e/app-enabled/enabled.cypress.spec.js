import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Check In Experience -- ', () => {
  describe('application behind feature toggle', () => {
    beforeEach(() => {
      const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('C5742 - Feature is enabled', () => {
      cy.visitWithUUID();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validatePage.dayOf();
    });
  });
});
