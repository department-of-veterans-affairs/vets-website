import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'checked in');
  };

  validatePageLoadedWithNoBtsssClaim = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'You’re checked in');
    cy.get('[data-testid="travel-pay-info-message"]', {
      timeout: Timeouts.slow,
    }).should('be.visible');
  };

  validatePageLoadedWithBtsssSubmission = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message-success"]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .and('include.text', 'We’re processing your travel reimbursement claim.');
  };

  validatePageLoadedWithBtsssIneligible = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message-ineligible"]', {
      timeout: Timeouts.slow,
    }).should('be.visible');
  };

  validatePageLoadedWithBtsssGenericFailure = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message-error"]', {
      timeout: Timeouts.slow,
    }).should('be.visible');
  };

  validateBackButton = appointmentCount => {
    if (appointmentCount > 1) {
      cy.get('[data-testid=go-to-appointments-button]', {
        timeout: Timeouts.slow,
      }).should('be.visible');
    } else {
      cy.get('[data-testid=go-to-appointments-button]', {
        timeout: Timeouts.slow,
      }).should('not.exist');
    }
  };

  validateConfirmationMessage = () => {
    cy.get('[data-testid="confirmation-message"]')
      .invoke('text')
      .should('have.length.gt', 0);
  };

  validateBTSSSLink = () => {
    cy.get('div[data-testid="btsss-link"] a:first').should(
      'have.text',
      'Find out how to request travel pay reimbursement',
    );
    cy.get('div[data-testid="btsss-link"] a:first')
      .invoke('attr', 'href')
      .should(
        'contain',
        '/resources/how-to-file-a-va-travel-reimbursement-claim-online/',
      );
  };

  attemptGoBackToAppointments = () => {
    cy.get('[data-testid=go-to-appointments-link]').click();
  };

  attemptGoBackToUpcomingAppointments = () => {
    cy.get('[data-testid=go-to-upcoming-appointments-link]').click();
  };

  attemptGoBackToAppointmentsButton = () => {
    cy.get('[data-testid=go-to-appointments-button]').click();
  };

  clickDetails = () => {
    cy.get('[data-testid=details-link]').click();
  };
}

export default new Confirmation();
