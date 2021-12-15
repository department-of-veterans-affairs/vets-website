import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Error from '../../../../tests/e2e/pages/Error';

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
    Error.validatePageLoaded();
  });
});
