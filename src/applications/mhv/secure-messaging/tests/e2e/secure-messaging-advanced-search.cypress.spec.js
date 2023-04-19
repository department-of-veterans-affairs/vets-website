import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';

describe(manifest.appName, () => {
  it('Advanced Search Axe Check', () => {
    // const site = new SecureMessagingSite();
    SecureMessagingSite.login();
    // const landingPage = new PatientInboxPage();
    PatientInboxPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftsFolder,
    ).as('basicSearchRequestDraftsMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages?per_page=-1**',
      mockMessages,
    ).as('basicSearchRequestDrafts');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/search',
      mockMessages,
    ).as('advancedSearchRequest');
    cy.get('[data-testid="advanced-search-toggle"]').click();

    cy.injectAxe();
    cy.axeCheck();

    cy.get('[data-testid="advanced-search-submit"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
