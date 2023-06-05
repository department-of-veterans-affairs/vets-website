import manifest from '../../../manifest.json';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockDraftsFolder from '../fixtures/folder-drafts-metadata.json';
import particularFolderResponse from '../fixtures/drafts-response.json';
import mockSearchMessages from '../fixtures/search-COVID-results.json';

describe(manifest.appName, () => {
  describe('Advanced search in Inbox keyboard nav', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      const landingPage = new PatientInboxPage();
      site.login();
      landingPage.loadInboxMessages();
      cy.intercept(
        'POST',
        '/my_health/v1/messaging/folders/*/search',
        mockSearchMessages,
      );
      landingPage.NavigateAdvancedSearch();
      landingPage.NavigateAdvancedSearchCategory();
      landingPage.KeyboardNavsubmitSearchButton();
    });
  });
  describe('Advanced search in Drafts keyboard nav', () => {
    beforeEach(() => {
      const site = new SecureMessagingSite();
      const landingPage = new PatientInboxPage();
      site.login();
      landingPage.loadInboxMessages();
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-2',
        mockDraftsFolder,
      );
      cy.intercept(
        'GET',
        '/my_health/v1/messaging/folders/-2/threads?**',
        particularFolderResponse,
      );
      cy.get('[data-testid="drafts-sidebar"]').click();
      cy.intercept(
        'POST',
        '/my_health/v1/messaging/folders/*/search',
        mockSearchMessages,
      );
      landingPage.NavigateAdvancedSearch();
      landingPage.selectAdvancedSearchCategory();
      landingPage.KeyboardNavsubmitSearchButton();
    });
    it('Check all draft messages contain the searched category', () => {
      cy.get('[data-testid="message-list-item"]')
        .should('contain', 'COVID')
        .and('have.length', mockSearchMessages.data.length);
      cy.injectAxe();
      cy.axeCheck();
    });
    it('Check the search message label', () => {
      cy.get('[data-testid="search-message-folder-input-label"]')
        .should('contain', '4')
        .and('contain', 'Category: "covid"');
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
