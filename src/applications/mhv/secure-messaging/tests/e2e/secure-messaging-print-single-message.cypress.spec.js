import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging - Print Functionality', () => {
  it('print all messages', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.body,
      landingPage.getNewMessage().attributes.category,
      landingPage.getNewMessage().attributes.sentDate,
      landingPage.getNewMessage().attributes.recipientId,
    );
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid=print-button]').click();
    cy.get('[data-testid=radio-print-one-message]')
      .shadow()
      .find('label')
      .should('have.text', 'Print only this message')
      .should('be.visible');
    cy.get('[data-testid=radio-print-all-messages]')
      .shadow()
      .find('label')
      .should('contain.text', 'Print all messages in this conversation')
      .should('be.visible');
    cy.get('[data-testid=print-modal-popup]')
      .shadow()
      .find('h1')
      .should('have.text', 'What do you want to print?')
      .should('be.visible');
    cy.get('[data-testid=radio-print-all-messages]').click();
    cy.window().then(win => {
      win.print();
      expect(win.print).to.be.calledOnce;
      cy.injectAxe();
      cy.axeCheck();
    });
    it('print single message', () => {
      site.login();
      landingPage.loadInboxMessages();
      landingPage.loadMessageDetails(
        landingPage.getNewMessage().attributes.messageId,
        landingPage.getNewMessage().attributes.subject,
        landingPage.getNewMessage().attributes.body,
        landingPage.getNewMessage().attributes.category,
        landingPage.getNewMessage().attributes.sentDate,
        landingPage.getNewMessage().attributes.recipientId,
      );
      cy.get('[data-testid=print-button]').click();
      cy.get('[data-testid=radio-print-one-message]').click();
      cy.window().then(win => {
        win.print();

        expect(win.print).to.be.calledOnce;
      });
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
