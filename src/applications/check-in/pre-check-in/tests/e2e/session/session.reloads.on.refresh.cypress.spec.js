import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Pre Check In Experience', () => {
  describe('session', () => {
    beforeEach(function() {
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
    it('On page reload, the data should be pull from session storage and redirected to landing screen with data loaded', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePageLoaded();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      cy.window().then(window => {
        const data = window.sessionStorage.getItem(
          'health.care.pre.check.in.current.uuid',
        );
        const sample = JSON.stringify({
          token: '0429dda5-4165-46be-9ed1-1e652a8dfd83',
        });
        expect(data).to.equal(sample);
        cy.reload();
        // redirected back to landing page to reload the data
        cy.url().should('match', /id=0429dda5-4165-46be-9ed1-1e652a8dfd83/);

        ValidateVeteran.validatePageLoaded();
        cy.injectAxeThenAxeCheck();
      });
    });
  });
});
