import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import error from '../../../../tests/e2e/pages/Error';

import apiInitializer from '../support/ApiInitializer';

describe('Pre Check In Experience', () => {
  describe('session', () => {
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

    it('Should show error page since there is no data to load locally', () => {
      const featureRoute = '/health-care/appointment-pre-check-in/introduction';
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
      cy.visit(featureRoute);
      error.validatePageLoaded();
    });
  });
});
