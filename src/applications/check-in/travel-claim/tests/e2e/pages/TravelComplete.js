import Timeouts from 'platform/testing/e2e/timeouts';

class TravelComplete {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-complete-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validateContent = () => {
    cy.get(`[data-testid="travel-pay--claim--submitted"]`).should('be.visible');
  };
}

export default new TravelComplete();
