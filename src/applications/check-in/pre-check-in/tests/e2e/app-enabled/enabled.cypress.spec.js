import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

import apiInitializer from '../support/ApiInitializer';

describe('Pre-Check In Experience', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    apiInitializer.initializeSessionGet.withSuccessfulNewSession();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Feature is enabled', () => {
    cy.visitPreCheckInWithUUID();
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Start pre-check-in');
  });
});
