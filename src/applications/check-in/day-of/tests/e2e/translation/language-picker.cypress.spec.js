import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import Demographics from '../../../../tests/e2e/pages/Demographics';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

import sharedData from '../../../../api/local-mock-api/mocks/v2/shared';

import Arrived from '../pages/Arrived';

const checkInUUID = sharedData.get.defaultUUID;

describe('Check In Experience -- ', () => {
  beforeEach(() => {
    const {
      initializeCheckInDataGet,
      initializeFeatureToggle,
      initializeSessionGet,
      initializeSessionPost,
    } = ApiInitializer;
    initializeFeatureToggle.withCurrentFeatures();
    initializeSessionGet.withSuccessfulNewSession();
    initializeSessionPost.withSuccess();
    initializeCheckInDataGet.withSuccess();
    // Verifies that browser language detection is working.
    cy.visitWithUUID(checkInUUID, 'es');
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Page language may be switched from spanish to english', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('es');
    cy.get('[data-testid="translate-button-en"]').click();
    ValidateVeteran.validatePage.dayOf('en');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Page language may be switched from spanish to tagalog', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('es');
    cy.get('[data-testid="translate-button-tl"]').click();
    ValidateVeteran.validatePage.dayOf('tl');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Language preference persists when navigating', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('es');
    cy.get('[data-testid="translate-button-en"]').click();
    ValidateVeteran.validatePage.dayOf('en');
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    Arrived.validateArrivedPage();
    Arrived.attemptToGoToNextPage();
    Demographics.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
  });
});
