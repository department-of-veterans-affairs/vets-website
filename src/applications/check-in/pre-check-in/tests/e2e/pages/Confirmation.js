import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'You’ve completed pre-check-in');
  };

  validatePageContent = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'You’ve completed pre-check-in');
    cy.get("[data-testid='confirmation-wrapper']");
    cy.get("p[data-testid='appointment-day-location']");
    cy.get("[data-testid='appointment-list']");
    cy.get("h3[data-testid='appointment-questions']")
      .should('be.visible')
      .and('have.text', 'What if I have questions about my appointment?');
  };

  validateConfirmWithUpdates = () => {
    cy.get("[data-testid='confirmation-update-alert']")
      .should('be.visible')
      .and(
        'have.text',
        'A staff member will help you on the day of your appointment to update your information.',
      );
  };

  validateConfirmNoUpdates = () => {
    cy.get("[data-testid='confirmation-update-alert']").should('not.exist');
  };
}

export default new Confirmation();
