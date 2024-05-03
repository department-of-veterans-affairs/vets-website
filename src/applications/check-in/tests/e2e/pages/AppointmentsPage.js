import Timeouts from 'platform/testing/e2e/timeouts';
import format from 'date-fns/format';

class AppointmentsPage {
  validatePageLoaded = () => {
    cy.get('h1[data-testid="header"]').should('be.visible');
  };

  validatePreCheckInSuccessAlert = () => {
    cy.get('[data-testid="pre-check-in-success-alert"]').should('be.visible');
  };

  validateWhatNextHeader = () => {
    cy.get('[data-testid="what-next-header"]').should('be.visible');
  };

  validateWhatNextCardTitle = {
    dayOf: () => {
      cy.get('[data-testid="what-next-card-title"]')
        .should('be.visible')
        .and(
          'include.text',
          "It's time to check in for your 3:00 p.m. appointment",
        );
    },
    preCheckIn: () => {
      cy.get('[data-testid="what-next-card-title"]')
        .should('be.visible')
        .and('include.text', 'Review your contact information for your');
    },
  };

  validateWhatNextCardDetailsLink = () => {
    cy.get('[data-testid="details-link"]').should('be.visible');
  };

  validateWhatNextCardActionLink = {
    dayOf: () => {
      cy.get('[data-testid="action-link"]').should('be.visible');
    },
    preCheckIn: () => {
      cy.get('[data-testid="action-link"]').should('be.visible');
    },
  };

  validateMultipleCards = (expectedCount = 2) => {
    cy.get('[data-testid="what-next-card"]').should(
      'have.length',
      expectedCount,
    );
  };

  validateCardOrder = () => {
    cy.wrap(
      cy.get('[data-testid="what-next-card"]', { timeout: Timeouts.slow })[0],
    )
      .get('[data-testid="what-next-card-title"]')
      .should('contain.text', '3:00 p.m.');
    cy.wrap(cy.get('[data-testid="what-next-card"]')[1])
      .get('[data-testid="what-next-card-title"]')
      .should('contain.text', '5:00 p.m.');
  };

  validateUpcomingAppointmentsHeader = () => {
    cy.get('[data-testid="upcoming-appointments-header"]').should('be.visible');
  };

  validateUpcomingAppointmentsList = () => {
    const expectedDaySeparators = ['26 Tue', '27 Wed', '26 Sun'];
    const expectedTimeOrder = ['2:00', '3:00', '4:00', '2:00', '2:00'];
    cy.get('[data-testid="appointments-list-monthyear-heading"]', {
      timeout: Timeouts.slow,
    })
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

  clickDetails = (appointment = 0) => {
    cy.get(`[data-testid="details-link-${appointment}"]`).click({
      waitForAnimations: true,
    });
  };

  clickUpcomingAppointmentDetails = (appointment = 2) => {
    cy.get(
      `section[data-testid="upcoming-appointments"] li:nth-child(${appointment}) [data-testid="details-link"]`,
    )
      .first()
      .click({
        waitForAnimations: true,
      });
  };

  attemptCheckIn = () => {
    cy.get('[data-testid="action-link"]')
      .first()
      .click({
        waitForAnimations: true,
      });
  };

  attemptPreCheckIn = () => {
    cy.get('button[data-testid="action-link"]').click({
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
}

export default new AppointmentsPage();
