import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  validatePageLoaded = () => {
    cy.get('va-alert > h1', { timeout: Timeouts.slow })
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
    cy.get('a[data-testid="btsss-link"]').should(
      'have.text',
      'Find out how to request travel pay reimbursement',
    );
    cy.get('a[data-testid="btsss-link"]')
      .invoke('attr', 'href')
      .should('contain', '/health-care/get-reimbursed-for-travel-pay/');
  };
}

export default new Confirmation();
