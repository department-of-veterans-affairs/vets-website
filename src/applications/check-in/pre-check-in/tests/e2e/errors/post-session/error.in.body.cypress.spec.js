import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';

import validateVeteran from '../../pages/ValidateVeteran';

import Error from '../../pages/Error';
import apiInitializer from '../../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('POST /check_in/v2/sessions/', () => {
      beforeEach(function() {
        cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
        apiInitializer.initializeSessionGet.withSuccessfulNewSession();

        apiInitializer.initializeSessionPost.withFailure(200);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('error in the body', () => {
        cy.visitPreCheckInWithUUID();
        // page: Validate
        validateVeteran.validatePageLoaded();
        validateVeteran.validateVeteran();
        cy.injectAxe();
        cy.axeCheck();

        validateVeteran.attemptToGoToNextPage();

        Error.validatePageLoaded();
      });
    });
  });
});
