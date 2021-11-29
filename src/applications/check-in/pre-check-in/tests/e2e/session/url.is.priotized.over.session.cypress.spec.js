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
          token: 'the-old-id',
        });
        window.sessionStorage.setItem(
          'health.care.check-in.current.uuid',
          sample,
        );
      });
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('Url is prioritized over session data', () => {
      cy.window().then(window => {
        const data = window.sessionStorage.getItem(
          'health.care.pre.check.in.current.uuid',
        );
        const sample = JSON.stringify({
          token: 'the-old-id',
        });
        expect(data).to.equal(sample);
      });
      cy.visitPreCheckInWithUUID();
      validateVeteran.validatePageLoaded();

      cy.window().then(window => {
        const data = window.sessionStorage.getItem(
          'health.care.check-in.current.uuid',
        );
        const sample = JSON.stringify({
          token: '0429dda5-4165-46be-9ed1-1e652a8dfd83',
        });
        expect(data).to.equal(sample);
      });
    });
  });
});
