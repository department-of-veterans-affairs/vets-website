import Timeouts from 'platform/testing/e2e/timeouts';
import { format } from 'date-fns';

class Introduction {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'Answer pre-check-in questions');
  };

  validateStartLinkStyling = () => {
    cy.get('[data-testid="start-button"] a').then($elements => {
      // Cypress can't access pseudo-elements, so we need get the window
      // object and assert against the element that way.
      const window = $elements[0].ownerDocument.defaultView;
      const before = window.getComputedStyle($elements[0], 'before');
      const elementColor = before.getPropertyValue('color');
      expect(elementColor).to.eq('rgb(0, 136, 23)');
    });
  };

  validateMultipleAppointmentIntroText = (
    appointmentDate = new Date().setDate(new Date().getDate() + 1),
  ) => {
    cy.get('p[data-testid="appointment-day-location"]').contains(
      `Your appointments are on ${format(appointmentDate, 'MMMM dd, Y')}`,
    );
  };

  validateSingleAppointmentIntroText = (appointmentDate = new Date()) => {
    cy.get('p[data-testid="appointment-day-location"]').contains(
      `Your appointment on ${format(
        appointmentDate,
        'MMMM dd, Y',
      )} at LOMA LINDA VA CLINIC.`,
    );
  };

  validateStartButtonBottomPlacement = () => {
    cy.get('div[data-testid="start-button"]')
      .contains('Answer questions')
      .parent()
      .prev()
      .contains('Start here')
      .prev()
      .contains('Your appointments are on');
  };

  validateStartButtonTopPlacement = () => {
    cy.get('div[data-testid="start-button"]')
      .contains('Complete pre-check-in')
      .parent()
      .prev()
      .contains('Your answers will');
  };

  countAppointmentList = expectedLength => {
    cy.get('ul[data-testid="appointment-list"] li').should(
      'have.length',
      expectedLength,
    );
  };

  toggleAccordion = (accordionIndex, open) => {
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
      .click({ waitForAnimations: true });
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
  };

  attemptToGoToNextPage = () => {
    cy.get('div[data-testid="intro-wrapper"] div[data-testid="start-button"] a')
      .eq(0)
      .click();
  };

  expandAccordion = () => {
    cy.get('[data-testid="intro-accordion-item"]')
      .shadow()
      .find('button[aria-controls="content"]')
      .click();
  };

  validateAppointmentType = type => {
    if (type === 'phone') {
      cy.get('[data-testid="appointment-kind-and-location"]').each(item => {
        expect(Cypress.$(item).text()).to.eq('Phone');
      });
    } else if (type === 'in-person') {
      cy.get('[data-testid="appointment-kind-and-location"]').each(item => {
        expect(Cypress.$(item).text()).to.contain('In person');
      });
    }
  };
}

export default new Introduction();
