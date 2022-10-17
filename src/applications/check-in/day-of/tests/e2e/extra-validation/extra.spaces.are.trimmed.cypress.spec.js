import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';
import Demographics from '../../../../tests/e2e/pages/Demographics';

describe('Check In Experience -- ', () => {
  describe('extra validation -- ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
        initializeCheckInDataGet,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess(req => {
        expect(req.body.session.lastName).to.equal('Smith');
        expect(req.body.session.last4).to.equal('4837');
      });
      initializeCheckInDataGet.withSuccess({
        numberOfCheckInAbledAppointments: 1,
      });
      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('validation trims white space before posting', () => {
      cy.injectAxeThenAxeCheck();
      ValidateVeteran.validateVeteran('Smith           ', '4837          ');
      ValidateVeteran.attemptToGoToNextPage();
      Demographics.validatePageLoaded();
    });
  });
});
