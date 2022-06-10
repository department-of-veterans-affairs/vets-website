import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();

    cy.window().then(window => {
      const sample = JSON.stringify({
        token: '46bebc0a-b99c-464f-a5c5-560bc9eae287',
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
  it('C5749 - On page reload, the data should be pull from session storage and redirected to landing screen with data loaded', () => {
    const featureRoute = '/health-care/appointment-check-in/details';
    cy.visit(featureRoute);
    // redirected back to landing page to reload the data
    cy.url().should('match', /verify/);
    ValidateVeteran.validatePage.dayOf();
    cy.injectAxeThenAxeCheck();
  });
});
