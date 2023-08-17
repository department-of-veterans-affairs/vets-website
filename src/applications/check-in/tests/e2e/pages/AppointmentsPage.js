import Timeouts from 'platform/testing/e2e/timeouts';

class AppointmentsPage {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Check-In Your Appointments');
  };

  attemptCheckIn = () => {
    cy.visit('health-care/appointment-check-in/contact-information');
  };

  attemptPreCheckIn = () => {
    cy.visit('health-care/appointment-pre-check-in/contact-information');
  };
}

export default new AppointmentsPage();
