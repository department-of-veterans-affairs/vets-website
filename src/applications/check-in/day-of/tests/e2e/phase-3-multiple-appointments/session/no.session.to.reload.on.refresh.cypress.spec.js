import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.authenticate();
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      generateFeatureToggles({
        checkInExperienceUpdateInformationPageEnabled: false,
      }),
    );
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });

  it('C5751 - Should show error page since there is no data to load locally', () => {
    const featureRoute = '/health-care/appointment-check-in/update-information';
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
    cy.visit(featureRoute);
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain', 'We couldn’t check you in');
  });
});
