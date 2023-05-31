import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import FolderManagementPage from './pages/FolderManagementPage';

import mockMessages from './fixtures/drafts-search-results.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import mockDeletedFolder from './fixtures/folder-deleted-metadata.json';
import mockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from './fixtures/message-custom-response.json';
import mockFoldersResponse from './fixtures/folder-response.json';
import commonFolderResponse from './fixtures/drafts-response.json';

describe('Secure Messaging Basic Search Tests', () => {
  const folderName = mockFoldersResponse.data.at(4).attributes.name;
  const { folderId } = mockFoldersResponse.data.at(4).attributes;
  beforeEach(() => {
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

  it('Basic Search Inbox Folder Check', () => {
    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch(0);
    PatientBasicSearchPage.verifyHighlightedText('test');

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Drafts Folder Check', () => {
    PatientMessageDraftsPage.loadDraftMessages();
    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch(-2);
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
      '/my_health/v1/messaging/folders/-1/threads?**',
      commonFolderResponse,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/search',
      mockMessages,
    ).as('basicSearchRequestSentFolder');
    cy.get('[data-testid="sent-sidebar"]').click();

    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch(-1);
    // cy.wait('@basicSearchRequestSentFolder');
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
      '/my_health/v1/messaging/folders/-3/threads?**',
      commonFolderResponse,
    ).as('basicSearchRequestDeletedFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-3/search',
      mockMessages,
    ).as('basicSearchRequestTrashFolder');
    cy.get('[data-testid="trash-sidebar"]').click();

    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch(-3);
    // cy.wait('@basicSearchRequestDeletedFolder');
    PatientBasicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Custom Folder Check', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    FolderManagementPage.clickAndLoadCustumFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockCustomMessagesResponse,
    );
    PatientBasicSearchPage.typeSearchInputFieldText('test');
    PatientBasicSearchPage.submitSearch(7038175);
    PatientBasicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck();
  });
});
