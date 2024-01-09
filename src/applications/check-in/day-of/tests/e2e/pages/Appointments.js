import Timeouts from 'platform/testing/e2e/timeouts';
import format from 'date-fns/format';

class Appointments {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('contain.text', 'Your appointments');
  };

  validateAppointmentLength = length => {
    cy.get('.appointment-list li').should('have.length', length);
  };

  validateUnavailableStatus = (appointmentNumber = 1) => {
    cy.get(
      `.appointment-list > li:nth-child(${appointmentNumber}) span[data-testid="unknown-reason-message"]`,
      {
        timeout: Timeouts.slow,
      },
    ).should(
      'contain',
      'Online check-in isn’t available for this appointment. Check in with a staff member.',
    );
  };

  validateEligibleStatus = (appointmentNumber = 1) => {
    cy.get(
      `.appointment-list > li:nth-child(${appointmentNumber}) [data-testid="check-in-button"]`,
      {
        timeout: Timeouts.slow,
      },
    )
      .should('be.visible')
      .shadow()
      .find('button')
      .and('contain', 'Check in now');
  };

  validateEarlyStatusWithTime = (appointmentNumber = 1) => {
    cy.get(
      `.appointment-list > li:nth-child(${appointmentNumber}) span[data-testid="too-early-message"]`,
      {
        timeout: Timeouts.slow,
      },
    ).should('contain', 'You can check in starting at 11:00 a.m.');
  };

  validateEarlyStatusWithoutTime = (appointmentNumber = 2) => {
    cy.get(
      `.appointment-list li:nth-child(${appointmentNumber}) span[data-testid="no-time-too-early-reason-message"]`,
      {
        timeout: Timeouts.slow,
      },
    ).should(
      'contain',
      'This appointment isn’t eligible for online check-in. Check-in with a staff member.',
    );
  };

  validateLateStatus = (appointmentNumber = 1) => {
    cy.get(
      `.appointment-list > li:nth-child(${appointmentNumber}) span[data-testid="too-late-message"]`,
      {
        timeout: Timeouts.slow,
      },
    ).should(
      'contain',
      'Your appointment started more than 15 minutes ago. We can’t check you in online. Ask a staff member for help.',
    );
  };

  validateUnknownStatus = (appointmentNumber = 1) => {
    cy.get(
      `.appointment-list > li:nth-child(${appointmentNumber}) span[data-testid="unknown-reason-message"]`,
      {
        timeout: Timeouts.slow,
      },
    ).should(
      'contain',
      'Online check-in isn’t available for this appointment. Check in with a staff member.',
    );
  };

  validateBadStatus = (appointmentNumber = 1) => {
    cy.get(
      `.appointment-list > li:nth-child(${appointmentNumber}) span[data-testid="ineligible-bad-status-message"]`,
      {
        timeout: Timeouts.slow,
      },
    ).should(
      'contain',
      'Online check-in isn’t available for this appointment. Check in with a staff member.',
    );
  };

  validateAppointmentTime = (
    appointmentNumber = 1,
    appointmentmentTime = '3:00 a.m.',
  ) => {
    cy.get(
      `:nth-child(${appointmentNumber}) > .check-in--appointment-summary > [data-testid=appointment-time]`,
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
      `li:nth-child(${appointmentNumber}) [data-testid=check-in-button]`,
    ).click({ waitForAnimations: true });
  };

  clickDetails = (appointment = 1) => {
    cy.get(`li:nth-child(${appointment}) [data-testid="details-link"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new Appointments();
