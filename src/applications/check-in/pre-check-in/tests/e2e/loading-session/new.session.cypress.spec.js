import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    apiInitializer.initializeSessionGet.withSuccessfulNewSession();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('a new sessions redirects to validate page', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    validateVeteran.validatePageLoaded();
  });
});
