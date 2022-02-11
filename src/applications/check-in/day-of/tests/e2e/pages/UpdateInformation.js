import Timeouts from 'platform/testing/e2e/timeouts';

class UpdateInformation {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('include.text', 'Do you need to update any information?');
  };

  attemptToGoToNextPage = (button = 'yes') => {
    cy.get(`button[data-testid="${button}-button"]`).click();
  };
}

export default new UpdateInformation();
