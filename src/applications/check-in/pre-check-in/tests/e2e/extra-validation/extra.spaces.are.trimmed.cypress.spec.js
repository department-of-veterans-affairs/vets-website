import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

describe('Pre-Check In Experience', () => {
  describe('Validate Page', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializePreCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess(req => {
        expect(req.body.session.lastName).to.equal('Smith');
      });
      initializePreCheckInDataGet.withSuccess();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation trims white space before posting', () => {
      cy.visitPreCheckInWithUUID();
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validatePage.preCheckIn();
      ValidateVeteran.validateVeteran('Smith           ', '1935', '04', '07');
      ValidateVeteran.attemptToGoToNextPage();
      AppointmentsPage.validatePageLoaded();
    });
  });
});
