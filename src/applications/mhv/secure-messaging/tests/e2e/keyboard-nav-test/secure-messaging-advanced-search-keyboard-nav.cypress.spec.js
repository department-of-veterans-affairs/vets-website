import manifest from '../../../manifest.json';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import mockDraftsFolder from '../fixtures/folder-drafts-metadata.json';
import particularFolderResponse from '../fixtures/drafts-response.json';
import mockSearchMessages from '../fixtures/search-COVID-results.json';

describe(manifest.appName, () => {
  describe('Advanced search in Drafts keyboard nav', () => {
    const site = new SecureMessagingSite();
    afterEach(() => {
      cy.get('[data-testid="message-list-item"]')
        .should('contain', 'COVID')
        .and('have.length', mockSearchMessages.data.length);
      cy.get('[data-testid="search-message-folder-input-label"]')
        .should('contain', '4')
        .and('contain', 'Category: "covid"');
      cy.injectAxe();
      cy.axeCheck();
    });

    it('check draft message advance search', () => {
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
      cy.injectAxe();
      cy.axeCheck();
    });
  });
});
