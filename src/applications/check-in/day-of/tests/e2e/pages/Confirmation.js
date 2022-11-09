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
    })
      .should('be.visible')
      .and(
        'include.text',
        'VA travel pay reimbursement pays eligible Veterans',
      );
  };

  validatePageLoadedWithBtsssSubmission = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'And we received your travel claim');
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'include.text',
        'You can check the status of your travel reimbursement claim online',
      );
  };

  validatePageLoadedWithBtsssIneligible = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', "couldn't file your travel claim");
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'include.text',
        'We’re sorry. We can’t file this type of travel reimbursement claim for you',
      );
  };

  validatePageLoadedWithBtsssGenericFailure = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', "couldn't file your travel claim");
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'TRAVEL CLAIM GENERIC ERROR PLACEHOLDER');
  };

  validatePageLoadedWithBtsssMultipleAppointmentsFailure = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', "couldn't file your travel claim");
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'TRAVEL CLAIM MULTIPLE ERROR PLACEHOLDER');
  };

  validatePageLoadedWithBtsssTravelClaimExistsFailure = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', "couldn't file your travel claim");
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'TRAVEL CLAIM EXISTS ERROR PLACEHOLDER');
  };

  validateBackButton = appointmentCount => {
    if (appointmentCount > 1) {
      cy.get('[data-testid=go-to-appointments-button]', {
        timeout: Timeouts.slow,
      })
        .should('be.visible')
        .and('include.text', "Back to today's appointments");
    } else {
      cy.get('[data-testid=go-to-appointments-button]', {
        timeout: Timeouts.slow,
      }).should('not.exist');
    }
  };

  validateConfirmationAlert = () => {
    cy.get('[data-testid="confirmation-alert"]')
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
      .should('contain', '/health-care/get-reimbursed-for-travel-pay/');
  };

  attemptGoBackToAppointments = () => {
    cy.get('[data-testid=go-to-appointments-button]').click();
  };
}

export default new Confirmation();
