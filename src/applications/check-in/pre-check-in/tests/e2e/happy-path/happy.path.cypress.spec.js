import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

import validateVeteran from '../pages/ValidateVeteran';

describe('Pre-Check In Experience ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
    validateVeteran.initializeApi();
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
    validateVeteran.attemptToGoToNextPage();

    // page: Introduction
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Answer pre check-in questions');

    cy.get('div[data-testid="intro-wrapper"] div[data-testid="start-button"] a')
      .eq(0)
      .click();
    // page: Demographics
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Demographics');

    cy.get('#react-root > :nth-child(3)').click();
    // page: Next of Kin
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Next of Kin');

    cy.get('#react-root > :nth-child(3)').click();
    // page: Confirmation
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Confirmation');
  });
});
