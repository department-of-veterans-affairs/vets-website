import Timeouts from 'platform/testing/e2e/timeouts';

class TravelIntro {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-intro-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  attemptToGoToNextPage = () => {
    cy.get(`[data-testid="file-claim-link"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new TravelIntro();
