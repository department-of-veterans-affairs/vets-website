import Timeouts from 'platform/testing/e2e/timeouts';

class Introduction {
  initializeApi() {
    // @TODO: fill in once we are actually using the API
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Answer pre check-in questions');
  }
  attemptToGoToNextPage() {
    cy.get('div[data-testid="intro-wrapper"] div[data-testid="start-button"] a')
      .eq(0)
      .click();
  }
}

export default new Introduction();
