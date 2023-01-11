import Timeouts from 'platform/testing/e2e/timeouts';

class AppointmentDetails {
  validatePageLoadedInPerson = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'In person appointment');
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

  validateWhere = (type = 'in-person') => {
    cy.get('div[data-testid="appointment-details--where"]').should(
      'be.visible',
    );
    cy.get('div[data-testid="appointment-details--clinic-value"]').should(
      'be.visible',
    );
    if (type === 'in-person') {
      cy.get('div[data-testid="appointment-details--location-value"]').should(
        'be.visible',
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

  returnToAppointmentsPage = () => {
    cy.get('button[data-testid="back-button"]').click({
      waitForAnimations: true,
    });
  };
}

export default new AppointmentDetails();
