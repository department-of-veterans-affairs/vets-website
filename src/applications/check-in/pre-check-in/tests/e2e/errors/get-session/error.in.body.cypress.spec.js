import { generateFeatureToggles } from '../../../../api/local-mock-api/mocks/feature.toggles';
import '../../support/commands';

import Error from '../../../../../tests/e2e/pages/Error';
import apiInitializer from '../../support/ApiInitializer';

describe('Pre-Check In Experience ', () => {
  describe('Error handling', () => {
    describe('GET /check_in/v2/session/', () => {
      beforeEach(function() {
        cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
        apiInitializer.initializeSessionGet.withFailure(200);

        apiInitializer.initializeSessionPost.withSuccess();

        apiInitializer.initializePreCheckInDataGet.withFailure(200);
      });
      afterEach(() => {
        cy.window().then(window => {
          window.sessionStorage.clear();
        });
      });
      it('bad status code(400)', () => {
        cy.visitPreCheckInWithUUID();

        Error.validatePageLoaded();
      });
    });
  });
});
