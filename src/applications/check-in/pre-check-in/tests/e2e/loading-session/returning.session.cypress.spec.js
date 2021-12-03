import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import introduction from '../pages/Introduction';
import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    apiInitializer.initializeSessionGet.withSuccessfulReturningSession();
    apiInitializer.initializePreCheckInDataGet.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('an existing session redirects to introduction page', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    introduction.validatePageLoaded();
  });
});
