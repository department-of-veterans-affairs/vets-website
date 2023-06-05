// import FolderResponse from './fixtures/folder-response.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Patient Message Count', () => {
  it('Patient Message Count', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.injectAxe();
    cy.axeCheck();
    cy.get('[data-testid="thread-list-item"]').should('have.length', 10);
    cy.visit('/my-health/secure-messages/');
    // Unknown tests (check the goal of testing)
    /*
    cy.get('[data-testid=Sent] a')
      .invoke('text')
      .should(
        'contain',
        `${FolderResponse.data[2].attributes.unreadCount} unread messages`,
      );
    cy.get('[data-testid=TEST2] a')
      .invoke('text')
      .should(
        'contain',
        `${FolderResponse.data[4].attributes.unreadCount} unread messages`,
      );
     */
  });
});
