import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = (lastValidateAttempt = false) => {
    const messageText = lastValidateAttempt
      ? "We're sorry. We couldn't match your information to our records. Please call us at 800-698-2411 (TTY:711) for help signing in."
      : 'We’re sorry. Something went wrong on our end. Please try again.';
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains(messageText);
  };

  validateExpiredPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains(
        'You can still check-in with your phone once you arrive at your appointment.',
      );
  };

  validateDatePreCheckInDateShows = () => {
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('You can pre-check in online until');
  };

  validateURL = () => {
    cy.url().should('match', /error/);
  };

  validateAccordionBlocks = () => {
    cy.get("[header='What is pre-check-in?']")
      .shadow()
      .find('button')
      .contains('What is pre-check-in?')
      .should('be.visible');
    cy.get("[header='How can I update my information?'][open='true']")
      .shadow()
      .find('button')
      .contains('How can I update my information?')
      .should('be.visible');
    cy.get('[header="Why can\'t I pre-check-in?"]')
      .shadow()
      .find('button')
      .contains("Why can't I pre-check-in?")
      .should('be.visible');
  };
}

export default new Error();
