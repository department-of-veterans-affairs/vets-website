import { generateFeatureToggles } from '../../../api/local-mock-api/mocks/feature.toggles';
import '../support/commands';
import Timeouts from 'platform/testing/e2e/timeouts';

describe('Check In Experience -- ', () => {
  beforeEach(function() {
    cy.intercept('GET', '/v0/feature_toggles*', generateFeatureToggles({}));
  });
  afterEach(() => {
    cy.window().then(window => {
      window.sessionStorage.clear();
    });
  });
  it('Feature is enabled', () => {
    cy.visitWithUUID();
    // page: Validate
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Prepare for your primary care appointment');

    cy.get('#react-root > button').click();
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
