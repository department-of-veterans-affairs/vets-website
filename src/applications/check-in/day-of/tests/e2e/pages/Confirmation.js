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
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'We’re processing your travel reimbursement claim.');
  };

  validatePageLoadedWithBtsssIneligible = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'include.text',
        'We’re sorry. We can’t file this type of travel reimbursement claim for you',
      );
  };

  validatePageLoadedWithBtsssGenericFailure = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'include.text',
        "We’re sorry, something went wrong on our end. We can't file a travel reimbursement claim for you now. But you can still file within 30 days of the appointment.",
      );
  };

  validatePageLoadedWithBtsssTravelClaimExistsFailure = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
    cy.get('[data-testid="travel-pay-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .and(
        'include.text',
        'You can check the status of your travel reimbursement claim online 24/7 on the Beneficiary Travel Self Service System (BTSSS). You can access BTSSS through the AccessVA travel claim portal.',
      );
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
    cy.get('[data-testid=go-to-appointments-button]').click();
  };

  clickDetails = () => {
    cy.get('[data-testid=details-link]').click();
  };
}

export default new Confirmation();
