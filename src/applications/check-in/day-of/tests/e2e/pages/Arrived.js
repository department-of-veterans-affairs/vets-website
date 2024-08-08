import Timeouts from 'platform/testing/e2e/timeouts';

class Arrived {
  validateArrivedPage = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Have you arrived');
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new Arrived();
