import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';

describe('Check In Experience', () => {
  describe('application behind feature toggle', () => {
    beforeEach(() => {
      ApiInitializer.initializeFeatureToggle.withAppsDisabled();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('C5740 - Feature is disabled', () => {
      cy.visitWithUUID();
      cy.url().should('not.match', /check-in/);
      cy.injectAxeThenAxeCheck();
    });
  });
});
