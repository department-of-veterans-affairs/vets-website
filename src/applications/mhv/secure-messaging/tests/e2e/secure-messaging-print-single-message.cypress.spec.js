import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import defaultMockThread from './fixtures/thread-response.json';

describe('Secure Messaging - Print Functionality', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const messageDetailsPage = new PatientMessageDetailsPage();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      landingPage.getNewMessageDetails(),
    );
    messageDetailsPage.loadMessageDetails(
      landingPage.getNewMessageDetails(),
      defaultMockThread,
      0,
    );
  });
  it('print all messages', () => {
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
