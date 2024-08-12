import Timeouts from 'platform/testing/e2e/timeouts';

class Confirmation {
  validatePageLoaded = () => {
    cy.get('h1', { timeout: Timeouts.slow }).should('be.visible');
  };

  validatePageContent = () => {
    cy.get("[data-testid='header']");
    cy.get("[data-testid='appointment-text']");
    cy.get("[data-testid='appointment-list']");
    cy.get("[data-testid='how-to-link']");
    cy.get("[data-testid='external-link']");
    cy.get("[data-testid='pre-check-in-accordions']");
  };

  validateDemographicsMessage = () => {
    cy.get("[header='How can I update my information?']").contains(
      "[header='How can I update my information?']",
      'Contact Information',
    );
  };

  validateEmergencyContactMessage = () => {
    cy.get("[header='How can I update my information?']").contains(
      "[header='How can I update my information?']",
      'Emergency information',
    );
  };

  validateNextOfKinMessage = () => {
    cy.get("[header='How can I update my information?']").contains(
      "[header='How can I update my information?']",
      'Next of kin',
    );
  };

  validateEmergencyContactAndNextOfKinMessage = () => {
    cy.get("[header='How can I update my information?']").contains(
      "[header='How can I update my information?']",
      'Emergency and next of kin information',
    );
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

  clickToResourcePage = () => {
    cy.get('[data-testid=what-to-bring-link]').click();
  };
}

export default new Confirmation();
