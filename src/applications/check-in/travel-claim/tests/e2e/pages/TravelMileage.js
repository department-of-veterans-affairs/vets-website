import Timeouts from 'platform/testing/e2e/timeouts';

class TravelMileage {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-mileage-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  attemptToGoToNextPage = () => {
    cy.get(`[data-testid="continue-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new TravelMileage();
