import Timeouts from 'platform/testing/e2e/timeouts';
import format from 'date-fns/format';

class UpcomingAppointmentsPage {
  validatePageLoaded = () => {
    cy.get('h1[data-testid="header"]').should('be.visible');
  };

  validateUpcomingAppointmentsHeader = () => {
    cy.get('[data-testid="upcoming-appointments-header"]').should('be.visible');
  };

  validateUpcomingAppointmentsList = () => {
    cy.get('[data-testid="upcoming-appointments-list"]').should('be.visible');
  };

  clickUpcomingAppointmentDetails = () => {
    cy.get('[data-testid="details-link"]')
      .first()
      .click({
        waitForAnimations: true,
      });
  };

  validateAppointmentTime = (
    appointmentNumber = 1,
    appointmentmentTime = '3:00 a.m.',
  ) => {
    cy.get(
      `[data-testid="appointments"] [data-testid="what-next-card"]:nth-child(${appointmentNumber})`,
      { timeout: Timeouts.slow },
    )
      .should('be.visible')
      .and('contain', appointmentmentTime);
  };

  validateUpdateDate = () => {
    cy.get('[data-testid=update-text]')
      .should('be.visible')
      .and(
        'contain',
        `Latest update: ${format(new Date(), "MMMM d, yyyy 'at' h:mm aaaa")}`,
      );
  };

  refreshAppointments = () => {
    cy.get('[data-testid=refresh-appointments-button]')
      .should('be.visible')
      .click();
  };

  validateErrorMessage = () => {
    cy.get('[data-testid="upcoming-appointments-error-message"]').should(
      'be.visible',
    );
  };

  attemptToGoBack = () => {
    cy.get('[data-testid=back-button]').click();
  };
}

export default new UpcomingAppointmentsPage();
