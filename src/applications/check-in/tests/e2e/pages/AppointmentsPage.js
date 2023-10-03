import Timeouts from 'platform/testing/e2e/timeouts';

class AppointmentsPage {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Check-In Your Appointments');
  };

  validateUpcomingAppointmentsHeader = () => {
    cy.get('[data-testid="upcoming-appointments-header"]')
      .should('be.visible')
      .and('include.text', 'Upcoming Appointments');
  };

  validateUpcomingAppointmentsList = () => {
    const expectedDaySeparators = ['Tue 26', 'Wed 27', 'Sun 26'];
    const expectedTimeOrder = ['2:00', '3:00', '4:00', '2:00', '2:00'];
    cy.get('[data-testid="appointments-list-monthyear-heading"]')
      .should('be.visible')
      .and('include.text', 'September 2023');
    cy.get('[data-testid="day-label"]').each((daySeparator, index) => {
      cy.wrap(daySeparator).should('contain', expectedDaySeparators[index]);
    });
    cy.get('[data-testid="appointment-time"]').each((appointment, index) => {
      cy.wrap(appointment).should('contain', expectedTimeOrder[index]);
    });
    cy.get('[data-testid="appointment-list"] > li')
      .should('be.visible')
      .its('length')
      .should('eq', 5);
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
