import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceEnabled: false,
      }),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5740 - Feature is disabled', () => {
    cy.visitWithUUID();
    cy.url().should('not.match', /check-in/);
  });
});
