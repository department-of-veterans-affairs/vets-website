import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  describe('validation page', () => {
    beforeEach(function() {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      apiInitializer.initializeSessionPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation failed', () => {
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();
      cy.get('[label="Your last name"]')
        .should('have.attr', 'autocorrect', 'false')
        .should('have.attr', 'spellcheck', 'false');
    });
  });
});
