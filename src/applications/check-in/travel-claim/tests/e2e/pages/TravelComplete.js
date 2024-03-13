import Timeouts from 'platform/testing/e2e/timeouts';

class TravelComplete {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-complete-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };
}

export default new TravelComplete();
