import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import error from '../../../../tests/e2e/pages/Error';
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
  it('No Token present', () => {
    cy.visit(`/health-care/appointment-pre-check-in`);
    error.validatePageLoaded();
  });
});
