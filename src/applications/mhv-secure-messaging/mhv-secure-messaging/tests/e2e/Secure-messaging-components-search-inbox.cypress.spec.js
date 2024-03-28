import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging Inbox', () => {
  it('Secure Messaging Inbox Filter Validation', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = landingPage.getNewMessageDetails();

    landingPage.loadInboxMessages(mockMessages, messageDetails);
    cy.get('#additional-filter-accordion')
      .shadow()
      .find('h3 button')
      .click();
    cy.get('#date-range-dropdown')
      .find('select')
      .select('Custom');
    cy.get('.fromToDatesContainer')
      .find('legend')
      .eq(0)
      .should('have.text', 'Start date (*Required)');
    cy.get('.fromToDatesContainer')
      .find('legend')
      .eq(1)
      .should('have.text', 'End date (*Required)');
    cy.get('[data-testid="filter-messages-button"]').click();
    cy.get('.fromToDatesContainer')
      .find('#error-message')
      .eq(0)
      .scrollIntoView()
      .should('contain.text', 'Please enter a start date.');
    cy.get('.fromToDatesContainer')
      .find('#error-message')
      .eq(1)
      .should('contain.text', 'Please enter an end date.');
  });
});
