import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('C5755 - On page reload, the data should be pull from session storage and redirected to landing screen with data loaded', () => {
    cy.visitWithUUID();
    ValidateVeteran.validatePage.dayOf();
    cy.injectAxeThenAxeCheck();
    cy.window().then(window => {
      const data = window.sessionStorage.getItem(
        'health.care.check-in.current.uuid',
      );
      const sample = JSON.stringify({
        token: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
      });
      expect(data).to.equal(sample);
      cy.reload();
      // redirected back to landing page to reload the data
      cy.url().should('match', /id=46bebc0a-b99c-464f-a5c5-560bc9eae287/);

      ValidateVeteran.validatePage.dayOf();
    });
  });
});
