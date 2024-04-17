import Timeouts from 'platform/testing/e2e/timeouts';

class TravelMileage {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-mileage-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validateContext = {
    singleFacility: () => {
      cy.get(`[data-testid="single-fac-context"]`).should('be.visible');
    },
    multiFacility: () => {
      cy.get(`[data-testid="multi-fac-context"]`).should('be.visible');
    },
  };

  attemptToGoToNextPage = () => {
    cy.get(`[data-testid="continue-button"]`).click({
      waitForAnimations: true,
    });
  };

  selectFacility = stationNo => {
    cy.get(`[data-testid="checkbox-${stationNo}"]`)
      .shadow()
      .find('.usa-checkbox')
      .click();
  };

  validateFacilityCount = expectedCount => {
    cy.get('[data-testid="checkbox-group"] [data-testid^="checkbox-"]').should(
      'have.length',
      expectedCount,
    );
  };

  checkForValidationError = () => {
    cy.get('va-checkbox')
      .shadow()
      .find('#checkbox-error-message');
  };
}

export default new TravelMileage();
