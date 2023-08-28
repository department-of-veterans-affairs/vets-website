import Timeouts from 'platform/testing/e2e/timeouts';

class AppointmentsPage {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Check-In Your Appointments');
  };

  attemptCheckIn = () => {
    cy.get('[data-testid="check-in-button"]').click({
      waitForAnimations: true,
    });
  };

  attemptPreCheckIn = () => {
    cy.get('button[data-testid="check-in-button"]').click({
      waitForAnimations: true,
    });
  };
}

export default new AppointmentsPage();
