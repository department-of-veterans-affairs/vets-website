import Timeouts from 'platform/testing/e2e/timeouts';

class TravelComplete {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-complete-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validateContent = type => {
    switch (type) {
      case 'single-claim-single-appointment':
        cy.get(
          `[data-testid="travel-pay-single-claim-single-appointment-submitted"]`,
        ).should('be.visible');
        break;
      case 'single-claim-multiple-appointments':
        cy.get(
          `[data-testid="travel-pay-single-claim-multi-appointment-submitted"]`,
        ).should('be.visible');
        break;
      case 'multiple-claims-single-appointment':
        cy.get(
          `[data-testid="travel-pay-multi-claims-single-appointment-submitted"]`,
        ).should('be.visible');
        break;
      case 'multiple-claims-multiple-appointments':
        cy.get(
          `[data-testid="travel-pay-multi-claims-multi-appointment-submitted"]`,
        ).should('be.visible');
        break;
      default:
        break;
    }
  };
}

export default new TravelComplete();
