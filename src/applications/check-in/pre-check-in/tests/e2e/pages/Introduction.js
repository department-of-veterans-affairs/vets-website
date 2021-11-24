import Timeouts from 'platform/testing/e2e/timeouts';

class Introduction {
  initializeApi() {
    // @TODO: fill in once we are actually using the API
  }
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Answer pre check-in questions');
  }
  validateMultipleAppointmentIntroText() {
    cy.get('p[data-testid="appointment-day-location"]').contains(
      'Your appointments on November 16, 2021 at LOMA LINDA VA CLINIC.',
    );
  }
  validateSingleAppointmentIntroText() {
    cy.get('p[data-testid="appointment-day-location"]').contains(
      'Your appointment is on November 16, 2021 at LOMA LINDA VA CLINIC.',
    );
  }
  countAppointmentList(expectedLength) {
    cy.get('ol[data-testid="appointment-list"] li').should(
      'have.length',
      expectedLength,
    );
  }
  toggleAccordion(accordionIndex, open) {
    if (open) {
      cy.get('[data-testid="intro-accordion-item"]')
        .shadow()
        .find('#content')
        .eq(accordionIndex)
        .should('not.be.visible');
    } else {
      cy.get('[data-testid="intro-accordion-item"]')
        .shadow()
        .find('#content')
        .eq(accordionIndex)
        .should('be.visible');
    }
    cy.get('[data-testid="intro-accordion-item"]')
      .shadow()
      .find('h2 button[aria-controls="content"]')
      .eq(accordionIndex)
      .click();
    if (open) {
      cy.get('[data-testid="intro-accordion-item"]')
        .shadow()
        .find('#content')
        .eq(accordionIndex)
        .should('be.visible');
    } else {
      cy.get('[data-testid="intro-accordion-item"]')
        .shadow()
        .find('#content')
        .eq(accordionIndex)
        .should('not.be.visible');
    }
  }
  validateExpirationDate() {
    // @TODO update to use date from mock data with math.
    cy.get('[data-testid="expiration-date"]').contains('11/15/2021');
  }
  attemptToGoToNextPage() {
    cy.get('div[data-testid="intro-wrapper"] div[data-testid="start-button"] a')
      .eq(0)
      .click();
  }
}

export default new Introduction();
