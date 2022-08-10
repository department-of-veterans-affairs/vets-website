import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Pre Check In Experience', () => {
  describe('session', () => {
    beforeEach(() => {
      const {
        initializeFeatureToggle,
        initializeSessionGet,
        initializeSessionPost,
      } = ApiInitializer;
      initializeFeatureToggle.withCurrentFeatures();
      initializeSessionGet.withSuccessfulNewSession();

      initializeSessionPost.withSuccess();

      cy.window().then(window => {
        const sample = JSON.stringify({
          token: 'the-old-id',
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
      ValidateVeteran.validatePage.preCheckIn();

      cy.injectAxeThenAxeCheck();
      cy.window().then(window => {
        const data = window.sessionStorage.getItem(
          'health.care.pre.check.in.current.uuid',
        );
        const sample = JSON.stringify({
          token: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
        });
        expect(data).to.equal(sample);
      });
    });
  });
});
