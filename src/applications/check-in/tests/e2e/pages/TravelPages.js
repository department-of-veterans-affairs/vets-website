import Timeouts from 'platform/testing/e2e/timeouts';

class TravelPages {
  validatePageLoaded = page => {
    let title = 'Would you like to file a travel reimbursement claim now?';
    switch (page) {
      case 'vehicle':
        title = 'Did you travel in your own vehicle?';
        break;
      case 'address':
        title = 'Did you travel from your home address? ';
        break;
      case 'mileage':
        title = 'Are you claiming only mileage for your trip?';
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
