import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import mockDeletedFolder from './fixtures/folder-deleted-metadata.json';
import mockCustomFolder from './fixtures/folder-custom-metadata.json';
// import mockFolders from '../fixtures/folder-response.json';

describe(manifest.appName, () => {
  const basicSearchPage = new PatientBasicSearchPage();
  beforeEach(() => {
    const landingPage = new PatientMessagesLandingPage();
    // const basicSearchPage = new PatientBasicSearchPage();
    landingPage.login();
    landingPage.loadPage();
    // basicSearchPage.clickSearchMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Basic Search Axe Check', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');

    // there is no way to click the search button because it is inaccessible in the shadow dom...
    // cy.get('[id="va-search-button"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Inbox Check', () => {
    //
    cy.get('.sidebar-navigation-messages-list-header > a').click();

    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchInboxRequest');

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchInboxRequest');
    basicSearchPage.typeSearchInputFieldText('test');
    cy.get('[id="va-search-input"]').type('test');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchInboxRequest');
    basicSearchPage.verifyHighlightedText('test');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Drafts Check', () => {
    cy.get('[data-testid="drafts-sidebar"] > a').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftsFolder,
    ).as('basicSearchRequestDraftsMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestDrafts');

    basicSearchPage.typeSearchInputFieldText('test');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDrafts');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Sent Folder Check', () => {
    cy.get('[data-testid="sent-sidebar"] > a').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolder,
    ).as('basicSearchRequestSentMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestSentFolder');

    basicSearchPage.typeSearchInputFieldText('test');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Trash Folder Check', () => {
    cy.get('[data-testid="trash-sidebar"] > a').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3',
      mockDeletedFolder,
    ).as('basicSearchRequestDeletedMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestDeletedFolder');

    basicSearchPage.typeSearchInputFieldText('test');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDeletedFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Custom Folder Check', () => {
    cy.get('[data-testid="my-folders-sidebar"] > a').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175',
      mockCustomFolder,
    ).as('basicSearchRequestCustomMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/7038175/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestCustomFolder');

    cy.get('.folders-list > :nth-child(1) > a').click({ force: true });
    basicSearchPage.typeSearchInputFieldText('test');
    // cy.contains('Test2').click({ force: true });
    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestCustomFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });
});
