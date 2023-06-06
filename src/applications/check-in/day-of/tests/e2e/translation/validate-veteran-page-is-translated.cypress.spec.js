import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

import sharedData from '../../../../api/local-mock-api/mocks/v2/shared';

const checkInUUID = sharedData.get.defaultUUID;

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    // Verifies that browser language detection is working.
    cy.visitWithUUID(checkInUUID, 'es');
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

describe('Check In Experience - Tagalog', () => {
  beforeEach(() => {
    const { initializeFeatureToggle, initializeSessionGet } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    // Verifies that browser language detection is working.
    cy.visitWithUUID(checkInUUID, 'tl');
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Validate Veteran page - tagalog', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('tl');
    cy.get('[data-testid="last-name-input"]')
      .shadow()
      .find('label')
      .should('be.visible')
      .and('have.text', 'Ang iyong apelyido (*Kailangan)');
    cy.injectAxe();
    cy.axeCheck();
  });
});
