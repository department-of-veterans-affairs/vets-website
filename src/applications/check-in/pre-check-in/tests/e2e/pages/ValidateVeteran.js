import Timeouts from 'platform/testing/e2e/timeouts';

class ValidateVeteran {
  initializeApi() {
    // @TODO: fill in once we are actually using the API
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Start pre-check-in');
  }
  validateVeteran(lastName = 'Smith', last4 = '1234') {
    cy.get('[label="Your last name"]')
      .shadow()
      .find('input')
      .type(lastName);
    cy.get('[label="Last 4 digits of your Social Security number"]')
      .shadow()
      .find('input')
      .type(last4);
  }

  attemptToGoToNextPage() {
    cy.get('[data-testid=check-in-button]').click();
  }
}

export default new ValidateVeteran();
