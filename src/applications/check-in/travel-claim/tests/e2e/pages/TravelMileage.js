import Timeouts from 'platform/testing/e2e/timeouts';

class TravelMileage {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-mileage-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validateContext = {
    singleFacility: () => {
      cy.get(`[data-testid="single-appointment-context"]`).should('be.visible');
    },
    multiFacility: () => {
      cy.get(`[data-testid="multi-appointment-context"]`).should('be.visible');
    },
  };

  attemptToGoToNextPage = () => {
    cy.get(`[data-testid="continue-button"]`).click({
      waitForAnimations: true,
    });
  };

  selectAppointment = appointmentId => {
    cy.get(`[data-testid="radio-${appointmentId}"]`)
      .find('.usa-radio__label')
      .click();
  };

  validateAppointmentCount = expectedCount => {
    cy.get('[data-testid="radio-set"] [data-testid^="radio-"]').should(
      'have.length',
      expectedCount,
    );
  };

  checkForValidationError = () => {
    cy.get('[data-testid="radio-set"]')
      .shadow()
      .find('.usa-error-message');
  };
}

export default new TravelMileage();
