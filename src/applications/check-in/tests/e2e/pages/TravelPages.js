import Timeouts from 'platform/testing/e2e/timeouts';

class TravelPages {
  validatePageLoaded = page => {
    let title = 'Would you like to file a travel reimbursement claim now?';
    switch (page) {
      case 'vehicle':
        title = 'Did you travel in your own vehicle?';
        break;
      case 'address':
        title = 'Did you travel from your home address?';
        break;
      case 'mileage':
        title = 'Are you claiming only mileage and no other expenses today?';
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

  validateContent = page => {
    let body = true;
    const helpText = true;
    if (page === 'vehicle' || page === 'mileage') {
      body = false;
    }
    if (helpText) {
      cy.get(`[data-testid="help-message"]`).should('be.visible');
    }
    if (body) {
      cy.get(`[data-testid="body-text"]`).should('be.visible');
    }
  };
}

export default new TravelPages();
