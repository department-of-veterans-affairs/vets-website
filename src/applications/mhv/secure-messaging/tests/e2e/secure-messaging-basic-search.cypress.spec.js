import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';

import mockSentFolder from './fixtures/folder-sent-metadata.json';
import mockDeletedFolder from './fixtures/folder-deleted-metadata.json';

import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from './fixtures/message-custom-response.json';
import mockFoldersResponse from './fixtures/folder-response.json';

describe('Secure Messaging Basic Search Tests', () => {
  const basicSearchPage = new PatientBasicSearchPage();
  const patientMessageDraftsPage = new PatientMessageDraftsPage();
  const folderPage = new FolderManagementPage();
  const folderName = mockFoldersResponse.data.at(4).attributes.name;
  const { folderId } = mockFoldersResponse.data.at(4).attributes;
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();

    site.login();
    landingPage.loadInboxMessages();
  });
  it('Basic Search Axe Check', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Basic Search Inbox Check', () => {
    basicSearchPage.typeSearchInputFieldText('test');
    basicSearchPage.submitInboxSearch();
    basicSearchPage.verifyHighlightedText('test');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it.skip('Basic Search Drafts Check', () => {
    patientMessageDraftsPage.loadDraftMessages();
    basicSearchPage.typeSearchInputFieldText('test');
    basicSearchPage.submitDraftSearch();
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    // this still fails the disabled test
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it.skip('Basic Search Sent Folder Check', () => {
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
    cy.get('[data-testid="sent-sidebar"]').click();

    basicSearchPage.typeSearchInputFieldText('test');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it.skip('Basic Search Trash Folder Check', () => {
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
    cy.get('[data-testid="trash-sidebar"]').click();

    basicSearchPage.typeSearchInputFieldText('test');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDeletedFolder');
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('Basic Search Custom Folder Check', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    folderPage.clickAndLoadCustumFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockCustomMessagesResponse,
    );
    basicSearchPage.typeSearchInputFieldText('test');
    basicSearchPage.submitCustomFolderSearch();
    basicSearchPage.verifyHighlightedText('test');
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
