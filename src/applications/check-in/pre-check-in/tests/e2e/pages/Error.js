import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
  };

  validatePageLoadedGeneric = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('[data-testid="something-went-wrong-message"]').should('be.visible');
    cy.get('[data-testid="mixed-modality-message"]').should('be.visible');
  };

  validatePageLoadedNotAvailable = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('[data-testid="something-went-wrong-message"]').should('be.visible');
    cy.get('[data-testid="mixed-modality-message"]').should('be.visible');
  };

  validatePageLoadedExpired = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('[data-testid="no-longer-available-message"]').should('be.visible');
    cy.get('[data-testid="mixed-modality-message"]').should('be.visible');
  };

  validateCanceledPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available.');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('is cancelled.');
  };

  validateAPIErrorPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow }).should(
      'be.visible',
    );
    cy.get('[data-testid="date-message"]').should('be.visible');
  };

  validateURL = () => {
    cy.url().should('match', /error/);
  };

  validateAccordionBlocks = () => {
    cy.get("[header='What is pre-check-in?']")
      .shadow()
      .find('button')
      .contains('What is pre-check-in?')
      .should('be.visible');
    cy.get("[header='How can I update my information?']")
      .shadow()
      .find('button')
      .contains('How can I update my information?')
      .should('be.visible');
    cy.get('[header="Why can’t I pre-check-in?"]')
      .shadow()
      .find('button')
      .contains('Why can’t I pre-check-in?')
      .should('be.visible');
  };
}

export default new Error();
