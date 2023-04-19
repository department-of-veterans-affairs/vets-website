import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import mockDeletedFolder from './fixtures/folder-deleted-metadata.json';
import mockCustomFolder from './fixtures/folder-custom-metadata.json';
import mockInboxFolder from './fixtures/folder-inbox-response.json';

describe('Secure Messaging Basic Search Tests', () => {
  // const basicSearchPage = new PatientBasicSearchPage();
  beforeEach(() => {
    // const landingPage = new PatientInboxPage();
    // const site = new SecureMessagingSite();
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Basic Search Axe Check', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Inbox Check', () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0',
      mockInboxFolder,
    ).as('basicSearchRequestInboxMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchInboxRequest');
    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch();
    PatientBasicSearchPage.verifyHighlightedText('test');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Drafts Check', () => {
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

    PatientBasicSearchPage.typeSearchInputFieldText('test');

    PatientBasicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDrafts');
    PatientBasicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Sent Folder Check', () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolder,
    ).as('basicSearchRequestSentMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/messages?per_page=-1**',
      mockMessages,
    ).as('basicSearchRequestSentFolder');
    cy.get('[data-testid="sent-sidebar"]').click();

    PatientBasicSearchPage.typeSearchInputFieldText('test');

    PatientBasicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');
    PatientBasicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Trash Folder Check', () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3',
      mockDeletedFolder,
    ).as('basicSearchRequestDeletedMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/messages?per_page=-1**',
      mockMessages,
    ).as('basicSearchRequestDeletedFolder');
    cy.get('[data-testid="trash-sidebar"]').click();

    PatientBasicSearchPage.typeSearchInputFieldText('test');

    PatientBasicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDeletedFolder');
    PatientBasicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Custom Folder Check', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175',
      mockCustomFolder,
    ).as('basicSearchRequestCustomMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175/messages?per_page=-1**',
      mockMessages,
    ).as('basicSearchRequestCustomFolder');

    cy.get('.folders-list > :nth-child(1) > a').click({ force: true });
    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestCustomFolder');
    PatientBasicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });
});
