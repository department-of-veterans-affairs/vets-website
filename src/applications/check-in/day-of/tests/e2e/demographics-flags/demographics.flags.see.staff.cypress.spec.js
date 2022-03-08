import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import SeeStaff from '../pages/SeeStaff';

describe('Check In Experience', () => {
  describe('Demographics Update Flags', () => {
    beforeEach(() => {
      const patchSpy = cy.spy().as('demographicsPatchSuccess');
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
        initializeDemographicsPatch,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();
      initializeCheckInDataGet.withSuccess();
      initializeDemographicsPatch.withSuccess(patchSpy);
    });

    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('see staff with demographics update', () => {
      cy.visitWithUUID();

      ValidateVeteran.validatePageLoaded('Check in at VA');
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran();
      ValidateVeteran.attemptToGoToNextPage();

      Demographics.validatePageLoaded();
      cy.injectAxeThenAxeCheck();
      Demographics.attemptToGoToNextPage('no');

      SeeStaff.validatePageLoaded();

      cy.get('@demographicsPatchSuccess').then(spy => {
        expect(spy).to.be.called;
      });
    });
  });
});
