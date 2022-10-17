import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../pages/Error';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withDayOfTranslationEnabled();
    initializeSessionGet.withFailure();
    // Verifies that browser language detection is working.
    cy.visitWithUUID(null, 'es');
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Error page - spanish', () => {
    Error.validatePageLoaded(null, 'es');
    cy.injectAxe();
    cy.axeCheck();
  });
});
