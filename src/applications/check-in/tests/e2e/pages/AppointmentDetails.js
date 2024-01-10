import Timeouts from 'platform/testing/e2e/timeouts';

class AppointmentDetails {
  validatePageLoadedInPerson = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'In-person appointment');
  };

  validatePageLoadedPhone = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Phone appointment');
  };

  validateSubtitleInPerson = () => {
    cy.get('p[data-testid="in-person-appointment-subtitle"]').should(
      'be.visible',
    );
  };

  validateSubtitlePhone = () => {
    cy.get('p[data-testid="phone-appointment-subtitle"]').should('be.visible');
  };

  validateWhen = () => {
    cy.get('div[data-testid="appointment-details--when"]').should('be.visible');
    cy.get('div[data-testid="appointment-details--date-value"]').should(
      'be.visible',
    );
  };

  validateWhat = () => {
    cy.get('div[data-testid="appointment-details--what"]').should('be.visible');
    cy.get('div[data-testid="appointment-details--appointment-value"]').should(
      'be.visible',
    );
  };

  validateProvider = () => {
    cy.get('div[data-testid="appointment-details--provider"]').should(
      'be.visible',
    );
    cy.get('div[data-testid="appointment-details--provider-value"]').should(
      'be.visible',
    );
  };

  validateDirectionsLink = visible => {
    if (visible) {
      cy.get('a[data-testid="directions-link"]').should('be.visible');
    } else {
      cy.get('a[data-testid="directions-link"]').should('not.exist');
    }
  };

  validateFacilityAddress = visible => {
    if (visible) {
      cy.get('div[data-testid="address-block"]').should('be.visible');
    } else {
      cy.get('div[data-testid="address-block"]').should('not.exist');
    }
  };

  validateWhere = (type = 'in-person') => {
    cy.get('div[data-testid="appointment-details--where"]').should(
      'be.visible',
    );
    cy.get('div[data-testid="appointment-details--clinic-value"]').should(
      'be.visible',
    );
    if (type === 'in-person') {
      cy.get('div[data-testid="appointment-details--facility-value"]').should(
        'be.visible',
      );

      cy.get('div[data-testid="appointment-details--location-value"]').should(
        'be.visible',
      );
    } else {
      cy.get('div[data-testid="appointment-details--facility-value"]').should(
        'not.exist',
      );
      cy.get('div[data-testid="appointment-details--location-value"]').should(
        'not.exist',
      );
    }
  };

  validatePhone = () => {
    cy.get('div[data-testid="appointment-details--phone"]').should(
      'be.visible',
    );
    cy.get('div[data-testid="appointment-details--phone-value"]').should(
      'be.visible',
    );
  };

  validateAppointmentMessage = () => {
    cy.get('div[data-testid="appointment-message"]').should('be.visible');
  };

  validateCheckedInMessage = () => {
    cy.get('span[data-testid="already-checked-in-no-time-message"]').should(
      'be.visible',
    );
  };

  validateNoAppointmentMessage = () => {
    cy.get('div[data-testid="appointment-message"]').should('not.exist');
  };

  validateCheckInButton = () => {
    cy.get('[data-testid="check-in-button"]').should('be.visible');
  };

  validateNoCheckInButton = () => {
    cy.get('[data-testid="check-in-button"]').should('not.exist');
  };

  validateReturnToAppointmentsPageButton = () => {
    cy.get('a[data-testid="back-button"]')
      .should('be.visible')
      .should('have.attr', 'href')
      .and('include', '#back');
  };

  clickCheckInButton = () => {
    cy.get('[data-testid="check-in-button"]').click({
      waitForAnimations: true,
    });
  };

  returnToAppointmentsPage = () => {
    cy.get('button[data-testid="back-button"]').click({
      waitForAnimations: true,
    });
  };
}

export default new AppointmentDetails();
