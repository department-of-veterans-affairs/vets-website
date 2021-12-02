import Timeouts from 'platform/testing/e2e/timeouts';
import { format } from 'date-fns';

class Introduction {
  validatePageLoaded() {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Answer pre-check-in questions');
  }
  validateMultipleAppointmentIntroText(appointmentDate = new Date()) {
    cy.get('p[data-testid="appointment-day-location"]').contains(
      `Your appointments on ${format(
        appointmentDate,
        'MMMM dd, Y',
      )} at LOMA LINDA VA CLINIC.`,
    );
  }
  validateSingleAppointmentIntroText(appointmentDate = new Date()) {
    cy.get('p[data-testid="appointment-day-location"]').contains(
      `Your appointment on ${format(
        appointmentDate,
        'MMMM dd, Y',
      )} at LOMA LINDA VA CLINIC.`,
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
  validateExpirationDate(appointmentTime) {
    const theDate = new Date(appointmentTime);
    const theDateBefore = new Date(theDate.getTime());
    theDateBefore.setDate(theDate.getDate() - 1);
    cy.get('[data-testid="expiration-date"]').contains(
      theDateBefore.toLocaleDateString(),
    );
  }
  attemptToGoToNextPage() {
    cy.get('div[data-testid="intro-wrapper"] div[data-testid="start-button"] a')
      .eq(0)
      .click();
  }
}

export default new Introduction();
