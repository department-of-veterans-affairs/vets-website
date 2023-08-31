import '../../../../tests/e2e/commands';

import ApiInitializer from '../../../../api/local-mock-api/e2e/ApiInitializer';
import ValidateVeteran from '../../../../tests/e2e/pages/ValidateVeteran';

import sharedData from '../../../../api/local-mock-api/mocks/v2/shared';
import AppointmentsPage from '../../../../tests/e2e/pages/AppointmentsPage';

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
    cy.injectAxeThenAxeCheck();
  });
  it('Page language may be switched from spanish to tagalog', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('es');
    cy.get('[data-testid="translate-button-tl"]').click();
    ValidateVeteran.validatePage.dayOf('tl');
    cy.injectAxeThenAxeCheck();
  });
  it('Language preference persists when navigating', () => {
    // App is translated.
    ValidateVeteran.validatePage.dayOf('es');
    cy.get('[data-testid="translate-button-en"]').click();
    ValidateVeteran.validatePage.dayOf('en');
    ValidateVeteran.validateVeteran();
    ValidateVeteran.attemptToGoToNextPage();
    AppointmentsPage.validatePageLoaded();
    cy.injectAxeThenAxeCheck();
    Arrived.validateArrivedPage();
    Arrived.attemptToGoToNextPage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
