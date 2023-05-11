import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsSearchMessages from './fixtures/drafts-search-COVID-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';
import draftResponce from './fixtures/drafts-response.json';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe(manifest.appName, () => {
  it('Advanced Search Axe Check', () => {
    const draftAdvancedSearch = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    site.login();
    const landingPage = new PatientInboxPage();
    landingPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftsFolder,
    ).as('basicSearchRequestDraftsMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads?**',
      draftResponce,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestDrafts');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/search',
      mockDraftsSearchMessages,
    ).as('advancedSearchRequest');
    draftAdvancedSearch.openAdvancedSearch();
    draftAdvancedSearch.selectCategory();
    draftAdvancedSearch.submitSearchButton();

    cy.get('[data-testid="message-list-item"]')
      .should('contain', 'COVID')
      .and('have.length', mockDraftsSearchMessages.data.length);
    cy.get('[data-testid="search-message-folder-input-label"]').should(
      'contain',
      '4',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
