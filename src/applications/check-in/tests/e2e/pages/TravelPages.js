import Timeouts from 'platform/testing/e2e/timeouts';

class TravelPages {
  validatePageLoaded = page => {
    let title = 'Would you like to file a travel reimbursement claim?';
    switch (page) {
      case 'mileage':
        title = 'Are you claiming only mileage and no other expenses?';
        break;
      case 'vehicle':
        title = 'Did you travel in your own vehicle?';
        break;
      case 'address':
        title = 'Did you travel from your home address?';
        break;
      case 'review':
        title = 'Review your travel claim';
        break;
      default:
        break;
    }
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', title);
  };

  // @TODO: replace validatePageLoaded with this function
  validatePageWrapper = testID => {
    cy.get(`[data-testid="${testID}"]`).should('be.visible');
  };

  validateHelpSection = () => {
    cy.get('[data-testid="for-help-using-this-tool"]').contains(
      'For help using this tool to prepare for your appointments',
    );

    cy.get('[data-testid="if-you-have-questions"]').contains(
      'If you have questions about your appointments',
    );
    cy.get('[data-testid="for-questions-about-filing"]').contains(
      'For questions about filing a travel reimbursement claim or to check',
    );
    cy.get('[data-testid="if-yourre-in-crisis"]').contains(
      'call the Veterans Crisis Line at',
    );
    cy.get('[data-testid="if-you-think-your-life-is-in-danger"]').contains(
      'If you think your life or health is in danger',
    );
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`[data-testid="${button}-button"]`).click({
      waitForAnimations: true,
    });
  };

  validateBackButton = page => {
    cy.get('a[data-testid="back-button"]').should(
      'have.text',
      'Back to last screen',
    );
    if (page === 'travel-pay') {
      cy.get('a[data-testid="back-button"]')
        .should('have.attr', 'href')
        .and('contain', 'next-of-kin');
    }
    if (page === 'mileage') {
      cy.get('a[data-testid="back-button"]')
        .should('have.attr', 'href')
        .and('contain', 'travel-pay');
    }
    if (page === 'address') {
      cy.get('a[data-testid="back-button"]')
        .should('have.attr', 'href')
        .and('contain', 'travel-vehicle');
    }
    if (page === 'mileage') {
      cy.get('a[data-testid="back-button"]')
        .should('have.attr', 'href')
        .and('contain', 'travel-pay');
    }
    if (page === 'review') {
      cy.get('a[data-testid="back-button"]')
        .should('have.attr', 'href')
        .and('contain', 'travel-address');
    }
  };

  validateContent = page => {
    let body = true;
    if (page === 'vehicle' || page === 'mileage') {
      body = false;
    }
    if (body) {
      cy.get(`[data-testid="body-text"]`).should('be.visible');
    }
  };

  clickStartOver = () => {
    cy.get(`a[data-testid="review-edit-link"]`).click({
      waitForAnimations: true,
    });
  };

  acceptTerms = () => {
    cy.get(`va-checkbox`)
      .shadow()
      .find(`[part="checkbox"]`)
      .click();
  };

  checkForValidationError = () => {
    cy.get('va-checkbox')
      .shadow()
      .find('#checkbox-error-message');
  };

  goBack = () => {
    cy.get('a[data-testid="back-button"]').click({
      waitForAnimations: true,
    });
  };

  clickBackButton = () => {
    cy.get('[data-testid="no-button"]').click({
      waitForAnimations: true,
    });
  };

  clickContinueButton = () => {
    cy.get('[data-testid="continue-button"]').click({
      waitForAnimations: true,
    });
  };

  clickAgreementLink = () => {
    cy.get(`[data-testid="travel-agreement-link"]`).click();
  };

  validateAgreementPage = () => {
    cy.get(`[data-testid="agreement-list-items"]`).should('be.visible');
  };
}

export default new TravelPages();
