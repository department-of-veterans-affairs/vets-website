import Timeouts from 'platform/testing/e2e/timeouts';

class Error {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains(
        'In-person appointmentYou can still check-in with your phone on the day of your appointment.Telephone appointmentYour provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
      );
  };

  validatePageLoadedGeneric = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in.');

    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains(
        'We’re sorry. Something went wrong on our end. Please try again.',
      );
  };

  validateUUIDErrorPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, we can’t complete pre-check-in.');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .should(
        'contain',
        'You can still check-in with your phone on the day of your appointment.',
      )
      .and(
        'contain',
        'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
      );
  };

  validateUuidNotFoundErrorPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'This link has expired.');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .should(
        'contain',
        'You can still check-in with your phone on the day of your appointment.',
      )
      .and(
        'contain',
        'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
      );
  };

  validateCanceledPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available.');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('is cancelled.');
  };

  validateExpiredPageLoaded = (appointmentType = 'in-person') => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available.');
    if (appointmentType === 'phone') {
      cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
        .should('be.visible')
        .contains(
          'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
        );
    } else {
      cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
        .should('be.visible')
        .contains(
          'You can still check-in with your phone once you arrive at your appointment.',
        );
    }
  };

  validatePast15MinutesPageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Sorry, pre-check-in is no longer available.');
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains(
        'We’re sorry. Pre-check-in is no longer available for your appointment time. Ask a staff member for help to check in.',
      );
  };

  validateDatePreCheckInDateShows = () => {
    cy.get('[data-testid="error-message"]', { timeout: Timeouts.slow })
      .should('be.visible')
      .contains('You can pre-check in online until');
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
    cy.get("[header='How can I update my information?'][open='true']")
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
