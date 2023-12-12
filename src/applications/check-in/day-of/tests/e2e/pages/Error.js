import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = (errorType = false) => {
    switch (errorType) {
      case 'max-validation':
        cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
        cy.get('[data-testid="error-message-max-validation"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        break;
      case 'check-in-past-appointment':
      case 'uuid-not-found':
        cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
        cy.get('[data-testid="error-message-trying-to-check-in"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        break;
      case 'check-in-failed-find-out':
        cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
        cy.get('[data-testid="error-message-checkin-error"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        cy.get('[data-testid="check-in-failed-find-out"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        break;
      case 'check-in-failed-cant-file':
        cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
        cy.get('[data-testid="error-message-checkin-error"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        cy.get('[data-testid="check-in-failed-cant-file"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        break;
      case 'check-in-failed-file-later':
        cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
        cy.get('[data-testid="error-message-checkin-error"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        cy.get('[data-testid="check-in-failed-file-later"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        break;
      default:
        cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
        cy.get('[data-testid="error-message-default-error"]', {
          timeout: Timeouts.slow,
        }).should('be.visible');
        break;
    }
  };

  validateDatePreCheckInDateShows = () => {
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
  };

  validateURL = () => {
    cy.url().should('match', /error/);
  };
}

export default new Error();
