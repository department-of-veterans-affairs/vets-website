import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
// import mockInboxFolder from './fixtures/folder-inbox-metadata.json';
// import inboxResponse from './fixtures/messages-response.json';
// import mockMessages from './fixtures/drafts-search-results.json';
import mockInboxSearchMessages from './fixtures/inbox-search-EDUCATION-results.json';

describe(manifest.appName, () => {
  describe('Advanced search in Inbox', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      const inboxPage = new PatientInboxPage();
      site.login();
      inboxPage.loadInboxMessages();
      // cy.intercept('GET', '/my_health/v1/messaging/folders/0', mockInboxFolder);
      // cy.intercept(
      //   'GET',
      //   '/my_health/v1/messaging/folders/0/threads?**',
      //   inboxResponse,
      // );
      // cy.intercept(
      //   'GET',
      //   '/my_health/v1/messaging/folders/0/messages?per_page=-1',
      //   inboxResponse,
      // ).as('basicSearchRequestDrafts');
      cy.intercept(
        'POST',
        '/my_health/v1/messaging/folders/*/search',
        mockInboxSearchMessages,
      );
      inboxPage.openAdvancedSearch();
      inboxPage.selectAdvancedSearchCategory();
      inboxPage.submitSearchButton();
    });
    it('Check all messages contain the searched category', () => {
      cy.get('[data-testid="message-list-item"]')
        .should('contain', 'Education')
        .and('have.length', mockInboxSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck();
    });
    it('Check the search message label', function() {
      cy.get('[data-testid="search-message-folder-input-label"]')
        .should('contain', '4')
        .and('contain', 'Category: "education"');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
