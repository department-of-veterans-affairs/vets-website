import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import mockDeletedFolder from './fixtures/folder-deleted-metadata.json';
import mockCustomFolder from './fixtures/folder-custom-metadata.json';

describe(manifest.appName, () => {
  const basicSearchPage = new PatientBasicSearchPage();
  beforeEach(() => {
    const landingPage = new PatientMessagesLandingPage();
    // const basicSearchPage = new PatientBasicSearchPage();
    landingPage.login();
    landingPage.loadPage();
    basicSearchPage.clickSearchMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Basic Search Axe Check', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');
    cy.get('[data-testid="basic-search-submit"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Inbox Check', () => {
    //
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

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchInboxRequest');
    basicSearchPage.verifyHighlightedText('test');

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
      '/my_health/v1/messaging/folders/-2/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestDrafts');

    basicSearchPage.typeSearchInputFieldText('test');
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Drafts', { force: true });
    // basicSearchPage.selectMessagesFolder('Drafts');
    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDrafts');
    basicSearchPage.verifyHighlightedText('test');
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
      '/my_health/v1/messaging/folders/-1/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestSentFolder');

    basicSearchPage.typeSearchInputFieldText('test');
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Sent', { force: true });
    // basicSearchPage.selectMessagesFolder('Sent');
    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Deleted Folder Check', () => {
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
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Deleted', { force: true });

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDeletedFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Custom Folder Check', () => {
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

    basicSearchPage.getInputFieldText('test');
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('TEST2', { force: true });

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestCustomFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });
});
