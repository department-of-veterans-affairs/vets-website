import SecureMessagingSite from './site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import manifest from '../../manifest.json';

describe(manifest.appName, () => {
  it('print single message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage(false);
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid=print-button]').click();
    cy.get('[data-testid=radio-print-one-message]')
      .shadow()
      .find('label')
      .should('have.text', 'Only print this message')
      .should('be.visible');
    cy.get('[data-testid=radio-print-all-messages]')
      .shadow()
      .find('label')
      .should('contain.text', 'Print all messages in this conversation')
      .should('be.visible');
    cy.get('[data-testid=print-modal-popup] p')
      .should(
        'have.text',
        'Would you like to print this one message, or all messages in this conversation?',
      )
      .should('be.visible');
    cy.get('[data-testid=radio-print-all-messages]').click();
    // cy.visit(`${cy.url()}/inner.html`, {
    //   onBeforeLoad: win => {
    //     cy.stub(win, 'print');
    //   },
    // });

    cy.window().then(win => {
      win.print();

      expect(win.print).to.be.calledOnce;
    });
    site.login();
    landingPage.loadPage(false);
    landingPage.loadMessageDetails(
      landingPage.getNewMessage().attributes.messageId,
      landingPage.getNewMessage().attributes.subject,
      landingPage.getNewMessage().attributes.sentDate,
    );
    cy.get('[data-testid=print-button]').click();
    cy.get('[data-testid=radio-print-one-message]').click();
    // cy.visit(
    //   'http://localhost:3001/my-health/secure-messages/message/7192838/inner.html',
    //   {
    //     onBeforeLoad: win => {
    //       cy.stub(win, 'print');
    //     },
    //   },
    // );
    cy.window().then(win => {
      win.print();

      expect(win.print).to.be.calledOnce;
    });
  });
});
