import Timeouts from 'platform/testing/e2e/timeouts';

class TravelPages {
  validatePageLoaded = page => {
    let title = 'Travel Question';
    switch (page) {
      case 'vehicle':
        title = 'Travel Vehicle';
        break;
      case 'address':
        title = 'Travel Address';
        break;
      case 'mileage':
        title = 'Travel Mileage';
        break;
      default:
        break;
    }
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', title);
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`button[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new TravelPages();
