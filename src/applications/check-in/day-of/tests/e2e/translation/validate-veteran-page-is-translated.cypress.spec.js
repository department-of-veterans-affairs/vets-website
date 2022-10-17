import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withDayOfTranslationEnabled();
    initializeSessionGet.withSuccessfulNewSession();
    // Verifies that browser language detection is working.
    cy.visitWithUUID(null, 'es');
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Validate Veteran page - spanish', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('es');
    // DS components are translated.
    cy.get('[data-testid="last-name-input"]')
      .shadow()
      .find('label')
      .should('be.visible')
      .and('have.text', 'Su apellido (*Requerido)');
    cy.injectAxe();
    cy.axeCheck();
  });
});
