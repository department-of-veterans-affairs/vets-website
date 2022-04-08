import Timeouts from 'platform/testing/e2e/timeouts';
import format from 'date-fns/format';

class Appointments {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Your appointments');
  };

  validateAppointmentLength = length => {
    cy.get('.appointment-list li').should('have.length', length);
  };

  validateUnavailableStatus = (appointmentNumber = 1) => {
    cy.get(`.appointment-list > li:nth-child(${appointmentNumber}) p`, {
      timeout: Timeouts.slow,
    }).should(
      'contain',
      'Online check-in isn’t available for this appointment. Check in with a staff member.',
    );
  };

  validateEligibleStatus = (appointmentNumber = 1) => {
    cy.get(`.appointment-list > li:nth-child(${appointmentNumber}) > button`, {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .and('contain', 'Check in now');
  };

  validateEarlyStatusWithTime = (appointmentNumber = 1) => {
    cy.get(`.appointment-list > li:nth-child(${appointmentNumber}) p`, {
      timeout: Timeouts.slow,
    }).should('contain', 'You can check in starting at this time: 11:00 a.m.');
  };

  validateEarlyStatusWithoutTime = (appointmentNumber = 2) => {
    cy.get(`.appointment-list li:nth-child(${appointmentNumber}) p`, {
      timeout: Timeouts.slow,
    }).should(
      'contain',
      'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
    );
  };

  validateLateStatus = (appointmentNumber = 1) => {
    cy.get(`.appointment-list > li:nth-child(${appointmentNumber}) p`, {
      timeout: Timeouts.slow,
    }).should(
      'contain',
      'Your appointment started more than 15 minutes ago. We can’t check you in online. Ask a staff member for help.',
    );
  };

  validateUnknownStatus = (appointmentNumber = 1) => {
    cy.get(`.appointment-list > li:nth-child(${appointmentNumber}) p`, {
      timeout: Timeouts.slow,
    }).should(
      'contain',
      'Online check-in isn’t available for this appointment. Check in with a staff member.',
    );
  };

  validateAppointmentTime = (
    appointmentNumber = 1,
    appointmentmentTime = '3:00 a.m.',
  ) => {
    cy.get(
      `:nth-child(${appointmentNumber}) > .appointment-summary > [data-testid=appointment-time]`,
      { timeout: Timeouts.slow },
    )
      .should('be.visible')
      .and('contain', appointmentmentTime);
  };

  validateAlreadyCheckedIn = (appointmentNumber = 2) => {
    cy.get(
      `:nth-child(${appointmentNumber}) [data-testid=already-checked-in-no-time-message]`,
      {
        timeout: Timeouts.slow,
      },
    ).should('be.visible');
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

  attemptCheckIn = (appointmentNumber = 1) => {
    cy.get(
      `:nth-child(${appointmentNumber}) > [data-testid=check-in-button]`,
    ).click({ waitForAnimations: true });
  };
}

export default new Appointments();
