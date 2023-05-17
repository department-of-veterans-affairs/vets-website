import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
// import mockMessages from './fixtures/drafts-search-results.json';
import mockSentSearchMessages from './fixtures/drafts-search-COVID-results.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import sentResponce from './fixtures/drafts-response.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe(manifest.appName, () => {
  describe('Advanced search in Sent', () => {
    beforeEach(() => {
      const sentAdvancedSearch = new PatientMessageDraftsPage();
      const site = new SecureMessagingSite();
      site.login();
      const landingPage = new PatientInboxPage();
      landingPage.loadInboxMessages();
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-1',
        mockSentFolder,
      ).as('basicSearchRequestDraftsMeta');
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-1/threads?**',
        sentResponce,
      );
      // cy.intercept(
      //   'GET',
      //   '/my_health/v1/messaging/folders/-1/messages?per_page=-1',
      //   mockMessages,
      // ).as('basicSearchRequestDrafts');
      cy.get('[data-testid="sent-sidebar"]').click();
      cy.intercept(
        'POST',
        '/my_health/v1/messaging/folders/*/search',
        mockSentSearchMessages,
      ).as('advancedSearchRequest');
      sentAdvancedSearch.openAdvancedSearch();
      sentAdvancedSearch.selectAdvancedSearchCategory();
      sentAdvancedSearch.submitSearchButton();
    });
    // Following assertion could be turned to the POM style
    it('Axe check ', () => {});
    it('Check all messages contain the serached category', () => {
      cy.get('[data-testid="message-list-item"]')
        .should('contain', 'COVID')
        .and('have.length', mockSentSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck();
    });
    it('Check the search message label', function() {
      cy.get('[data-testid="search-message-folder-input-label"]')
        .should('contain', '4')
        .and('contain', 'Category: "covid"');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
