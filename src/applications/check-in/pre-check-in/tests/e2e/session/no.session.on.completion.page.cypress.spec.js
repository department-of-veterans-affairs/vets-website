import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';

import Error from '../pages/Error';

describe('Pre Check In Experience', () => {
  describe('session', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializePreCheckInDataPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializePreCheckInDataPost.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });

    it('Should not attempt to send pre-checkin data since there is no session', () => {
      const featureRoute = '/health-care/appointment-pre-check-in/complete';
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
      cy.visit(featureRoute);
      Error.validatePageLoaded();

      // Handle timeout error when waiting for request we don't expect to be made.
      Cypress.on('fail', error => {
        if (error.message.indexOf('Timed out retrying after 250ms') !== 0) {
          throw error;
        }
      });

      // Assert that we did not try to post pre-checkin data.
      cy.wait('@post-pre_check_ins-success', {
        requestTimeout: 250,
      }).then(xhr => {
        assert.isNull(xhr.response.body);
      });
      cy.injectAxeThenAxeCheck();
    });
  });
});
