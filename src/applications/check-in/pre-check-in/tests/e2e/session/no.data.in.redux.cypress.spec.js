import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';

import validateVeteran from '../pages/ValidateVeteran';

import apiInitializer from '../support/ApiInitializer';

describe('Pre Check In Experience', () => {
  describe('session', () => {
    beforeEach(function() {
      cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
      apiInitializer.initializeSessionGet.withSuccessfulNewSession();

      apiInitializer.initializeSessionPost.withSuccess();

      cy.window().then(window => {
        const sample = JSON.stringify({
          token: '0429dda5-4165-46be-9ed1-1e652a8dfd83',
        });
        window.sessionStorage.setItem(
          'health.care.pre.check.in.current.uuid',
          sample,
        );
      });
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('On page reload, the data should be pull from session storage and redirected to landing screen with data loaded', () => {
      const featureRoute = '/health-care/appointment-pre-check-in/introduction';
      cy.visit(featureRoute);
      // redirected back to landing page to reload the data
      validateVeteran.validatePageLoaded();
    });
  });
});
