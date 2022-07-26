import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'checked in');
  };

  validateBackButton = () => {
    cy.get('[data-testid=go-to-appointments-button]', {
      timeout: Timeouts.slow,
    })
      .should('be.visible')
      .and('include.text', 'Go to another appointment');
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
