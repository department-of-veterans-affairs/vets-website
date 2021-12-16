import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import introduction from '../pages/Introduction';

import apiInitializer from '../support/ApiInitializer';

describe('Pre Check In Experience', () => {
  describe('requires form', () => {
    beforeEach(function() {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      apiInitializer.initializeSessionPost.withSuccess();

      apiInitializer.initializePreCheckInDataGet.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('On page reload, on verify, this should redirect to the landing page', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();

      cy.reload();
      // redirected back to landing page to reload the data
      cy.url().should('match', /id=0429dda5-4165-46be-9ed1-1e652a8dfd83/);

      validateVeteran.validatePageLoaded();
      validateVeteran.validateVeteran();
      validateVeteran.attemptToGoToNextPage();

      introduction.validatePageLoaded();
    });
  });
});
