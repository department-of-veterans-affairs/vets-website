import Timeouts from 'platform/testing/e2e/timeouts';

class SeeStaff {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Check in with a staff member');
  };

  validateMessage = (
    message = 'Our staff can help you update your contact information.If you don’t live at a fixed address right now, we’ll help you find the best way to stay connected with us.',
  ) => {
    cy.get('h1')
      .next()
      .should('be.visible')
      .and('have.text', message);
  };

  validateBackButton = () => {
    cy.get('[data-testid=back-button]')
      .should('be.visible')
      .and('have.text', 'Back to last screen');
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

  selectBackButton = () => {
    cy.get('[data-testid="back-button"]').click();
  };
}

export default new SeeStaff();
