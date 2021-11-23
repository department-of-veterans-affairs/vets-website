import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

describe('Pre-Check In Experience', () => {
  beforeEach(function() {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        preCheckInEnabled: false,
      }),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Feature is disabled', () => {
    cy.visitPreCheckInWithUUID();
    cy.url().should('not.match', /check-in/);
  });
});
