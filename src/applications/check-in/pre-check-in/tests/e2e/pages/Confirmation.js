import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  initializeApi() {
    // @TODO: fill in once we are actually using the API
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'You’ve completed pre check-in');
    cy.get('h3', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'What if I have questions about my appointment');
  }
}

export default new Confirmation();
