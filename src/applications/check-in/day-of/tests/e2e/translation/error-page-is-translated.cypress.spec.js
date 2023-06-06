import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Error from '../pages/Error';

describe('Check In Experience -- Error page is translated - Spanish', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
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
    Error.validatePageLoaded(false, 'es');
    cy.injectAxe();
    cy.axeCheck();
  });
});

describe('Check In Experience -- Error page is translated - Tagalog', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withFailure();
    // Verifies that browser language detection is working.
    cy.visitWithUUID(null, 'tl');
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Error page - tagalog', () => {
    Error.validatePageLoaded(false, 'tl');
    cy.injectAxe();
    cy.axeCheck();
  });
});
