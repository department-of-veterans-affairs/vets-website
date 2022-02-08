import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = (lastValidateAttempt = false) => {
    const messageText = lastValidateAttempt
      ? "We're sorry. We couldn't match your information to our records. Please ask a staff member for help."
      : 'We’re sorry. Something went wrong on our end. Check in with a staff member.';
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'We couldn’t check you in');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', messageText);
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
