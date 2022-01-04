import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Introduction from '../pages/Introduction';

describe('Pre Check In Experience', () => {
  describe('requires form', () => {
    beforeEach(function() {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withoutEmergencyContact();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializePreCheckInDataGet.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('On page reload, on verify, this should redirect to the landing page', () => {
      cy.visitPreCheckInWithUUID();
      ValidateVeteran.validatePageLoaded();

      cy.reload();
      // redirected back to landing page to reload the data
      cy.url().should('match', /id=0429dda5-4165-46be-9ed1-1e652a8dfd83/);

      ValidateVeteran.validatePageLoaded();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Introduction.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
    });
  });
});
