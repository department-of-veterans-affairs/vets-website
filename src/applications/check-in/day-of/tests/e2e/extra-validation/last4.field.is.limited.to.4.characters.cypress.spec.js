import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Check In Experience -- ', () => {
  describe('extra validation -- ', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();
      initializeSessionPost.withSuccess();

      cy.visitWithUUID();
      ValidateVeteran.validatePage.dayOf();
    });
    afterEach(() => {
      cy.window().then(window => {
        window.sessionStorage.clear();
      });
    });
    it('only allows typing 4 characters', () => {
      ValidateVeteran.typeLast4('12345');
      ValidateVeteran.validateTypedLast4();
      ValidateVeteran.validateMax4Text();
      cy.injectAxeThenAxeCheck();
    });
  });
});
