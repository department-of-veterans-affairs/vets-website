import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'You’ve completed pre-check-in');
  };

  validatePageContent = () => {
    cy.get('h1', { timeout: Timeouts.slow })
      .should('be.visible')
      .and('have.text', 'You’ve completed pre-check-in');
    cy.get("[data-testid='confirmation-wrapper']");
    cy.get("p[data-testid='appointment-day-location']");
    cy.get("[data-testid='appointment-list']");
    cy.get("[header='What if I have questions about my appointment?']")
      .shadow()
      .find('button')
      .contains('What if I have questions about my appointment?')
      .should('be.visible');
  };

  validateConfirmWithUpdates = () => {
    cy.get("[header='How can I update my information?'][open='true']")
      .shadow()
      .find('button')
      .contains('How can I update my information?')
      .should('be.visible');
  };

  validateConfirmNoUpdates = () => {
    cy.get("[header='How can I update my information?']").should('not.exist');
  };

  validateDemographicsMessage = () => {
    cy.get("[header='How can I update my information?']")
      .contains(
        "[header='How can I update my information?']",
        'Contact Information',
      )
      .contains(
        "[header='How can I update my information?']",
        'A staff member will help you on the day of your appointment.',
        'Or you can sign in to your VA.gov profile to update your contact information online.',
      );
  };

  validateEmergencyContactMessage = () => {
    cy.get("[header='How can I update my information?']")
      .contains(
        "[header='How can I update my information?']",
        'Emergency information',
      )
      .contains(
        "[header='How can I update my information?']",
        'A staff member will help you on the day of your appointment.',
      );
  };

  validateNextOfKinMessage = () => {
    cy.get("[header='How can I update my information?']")
      .contains("[header='How can I update my information?']", 'Next of kin')
      .contains(
        "[header='How can I update my information?']",
        'A staff member will help you on the day of your appointment.',
      );
  };

  validateEmergencyContactAndNextOfKinMessage = () => {
    cy.get("[header='How can I update my information?']")
      .contains(
        "[header='How can I update my information?']",
        'Emergency and next of kin information',
      )
      .contains(
        "[header='How can I update my information?']",
        'A staff member will help you on the day of your appointment.',
      );
  };

  expandAllAccordions = () => {
    cy.get('[data-testid="pre-check-in-accordions"]')
      .shadow()
      .find('button[aria-label="Expand all accordions"]')
      .click();
  };

  validateAppointmentType = type => {
    if (type === 'phone') {
      cy.get('[data-testid="appointment-kind-and-location"]').each(item => {
        expect(Cypress.$(item).text()).to.eq('Phone');
      });
      cy.get('[data-testid="appointment-message"]').each(item => {
        expect(Cypress.$(item).text()).to.eq(
          'Your provider will call you at your appointment time. You may need to wait about 15 minutes for their call. Thanks for your patience.',
        );
      });
    } else if (type === 'in-person') {
      cy.get('[data-testid="appointment-kind-and-location"]').each(item => {
        expect(Cypress.$(item).text()).to.eq('In person');
      });
      cy.get('[data-testid="appointment-message"]').each(item => {
        expect(Cypress.$(item).text()).to.eq(
          'Please bring your insurance cards with you to your appointment.',
        );
      });
    }
  };

  clickDetails = (appointment = 1) => {
    cy.get(`li:nth-child(${appointment}) [data-testid="details-link"]`).click({
      waitForAnimations: true,
    });
  };
}

export default new Confirmation();
