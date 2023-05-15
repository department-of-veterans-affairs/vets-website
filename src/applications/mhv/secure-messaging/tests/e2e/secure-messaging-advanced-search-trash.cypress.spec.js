import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
// import mockMessages from './fixtures/drafts-search-results.json';
import mockTrashSearchMessages from './fixtures/drafts-search-COVID-results.json';
import mockTrashFolder from './fixtures/folder-sent-metadata.json';
import trashResponce from './fixtures/drafts-response.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe(manifest.appName, () => {
  describe('Advanced search in Sent', () => {
    beforeEach(() => {
      const trashAdvancedSearch = new PatientMessageDraftsPage();
      const site = new SecureMessagingSite();
      site.login();
      const landingPage = new PatientInboxPage();
      landingPage.loadInboxMessages();
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-3',
        mockTrashFolder,
      );
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-3/threads?**',
        trashResponce,
      );
      // cy.intercept(
      //   'GET',
      //   '/my_health/v1/messaging/folders/-3/messages?per_page=-1',
      //   mockMessages,
      // );
      cy.get('[data-testid="trash-sidebar"]').click();
      cy.intercept(
        'POST',
        '/my_health/v1/messaging/folders/*/search',
        mockTrashSearchMessages,
      );
      trashAdvancedSearch.openAdvancedSearch();
      trashAdvancedSearch.selectAdvancedSearchCategory();
      trashAdvancedSearch.submitSearchButton();
    });
    // Following assertion could be turned to the POM style
    it('Axe check ', () => {
      cy.injectAxe();
      cy.axeCheck();
    });
    it('Check all messages contain the serached category', () => {
      cy.get('[data-testid="message-list-item"]')
        .should('contain', 'COVID')
        .and('have.length', mockTrashSearchMessages.data.length);
    });
    it('Check the search message label', function() {
      cy.get('[data-testid="search-message-folder-input-label"]')
        .should('contain', '4')
        .and('contain', 'Category: "covid"');
    });
  });
});
