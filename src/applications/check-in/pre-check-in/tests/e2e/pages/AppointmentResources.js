import Timeouts from 'platform/testing/e2e/timeouts';

class AppointmentResources {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validatePageContent = () => {
    cy.get("[data-testid='resouces-page']");
    cy.get("[data-testid='back-button']");
  };

  clickBack = () => {
    cy.get("[data-testid='back-button']").click({
      waitForAnimations: true,
    });
  };
}

export default new AppointmentResources();
