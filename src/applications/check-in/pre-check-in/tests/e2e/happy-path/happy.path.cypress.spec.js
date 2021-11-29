import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

import validateVeteran from '../pages/ValidateVeteran';
import introduction from '../pages/Introduction';

describe('Pre-Check In Experience ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    validateVeteran.initializeSessionPost.withSuccess();
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Happy Path', () => {
    cy.visitPreCheckInWithUUID();
    // page: Validate
    validateVeteran.validatePageLoaded();
    validateVeteran.validateVeteran();
    cy.injectAxe();
    cy.axeCheck();

    validateVeteran.attemptToGoToNextPage();

    // page: Introduction
    introduction.validatePageLoaded();
    cy.injectAxe();
    cy.axeCheck();
    introduction.attemptToGoToNextPage();

    // page: Demographics
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Is this your current contact information?');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('button[data-testid="yes-button"]').click();

    // page: Next of Kin
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Next of Kin');
    cy.injectAxe();
    cy.axeCheck();
    cy.get('#react-root > :nth-child(3)').click();

    // page: Confirmation
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Confirmation');
    cy.injectAxe();
    cy.axeCheck();
  });
});
