import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = (lastValidateAttempt = false) => {
    const messageText = lastValidateAttempt
      ? "We're sorry. We couldn't match your information to our records. Call us at 800-698-2411 (TTY: 711) for help signing in."
      : 'We’re sorry. Something went wrong on our end. Please try again.';
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', "We couldn't complete pre-check-in");
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains(messageText);
  };

  validateDatePreCheckInDateShows = () => {
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('You can pre-check in online until');
  };

  validateURL = () => {
    cy.url().should('match', /error/);
  };
}

export default new Error();
