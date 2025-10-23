import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = () => {
    cy.get(`[data-testid="travel-error-page"]`).should('be.visible');
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validateErrorAlert = error => {
    switch (error) {
      case 'uuid-not-found':
        cy.get('[data-testid="expired-link-alert"]').should('be.visible');
        break;
      case 'max-validation':
        cy.get('[data-testid="no-matching-information-alert"]').should(
          'be.visible',
        );
        break;
      case 'cant-file-claim-type':
        cy.get('[data-testid="cant-file-claim-type-alert"]').should(
          'be.visible',
        );
        break;
      case 'already-filed-claim':
        cy.get('[data-testid="already-filed-claim-alert"]').should(
          'be.visible',
        );
        break;
      case 'completing-travel-submission':
        cy.get('[data-testid="something-went-wrong-alert"]').should(
          'be.visible',
        );
        break;
      default:
        cy.get('[data-testid="we-cant-file-a-claim-alert"]').should(
          'be.visible',
        );
    }
  };
}

export default new Error();
