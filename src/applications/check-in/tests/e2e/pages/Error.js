import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'We couldn’t check you in');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'have.text',
        'We’re sorry. Something went wrong on our end. Check in with a staff member.',
      );
  }
  validateURL() {
    cy.url().should('match', /error/);
  }
}

export default new Error();
