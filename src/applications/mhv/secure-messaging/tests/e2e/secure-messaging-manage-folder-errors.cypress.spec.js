import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import MockFoldersResponse from './fixtures/folder-response.json';
import mockMessages from './fixtures/messages-response.json';
// import mockRecipients from './fixtures/recipients-response.json';
import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import FolderManagementPage from './pages/FolderManagementPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';

describe('Secure Messaging Manage Folder Errors check', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
  });
  it.skip('Axe Check Delete Folder Network Error', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();
    const folderName = MockFoldersResponse.data.at(4).attributes.name;
    const folderID = MockFoldersResponse.data.at(4).attributes.folderId;
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderID}*`,
      MockCustomFolderResponse,
    ).as('customFolderID');
    cy.intercept(
      'GET',
      `my_health/v1/messaging/folders/${folderID}/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC`,
      mockMessages,
    ).as('customFolderThreads');
    cy.contains(folderName).click();

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderID}`, {
      forceNetworkError: true,
    }).as('deleteCustomMessage');
    cy.get('[data-testid="remove-folder-button"]').click();
    cy.get('[data-testid="error-folder-not-empty"]')
      .shadow()
      .contains('Empty this folder');
  });

  it.skip('Edit Folder Name check error on blank input', () => {
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();
    folderPage.editFolderNameButton().click();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('input')
      .click();
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('input')
      .should('be.focused');
    cy.realPress(['Enter']);
    cy.realPress(['Tab']);
    cy.realPress(['Enter']);
    cy.get('[name="new-folder-name"]')
      .shadow()
      .find('#input-error-message')
      .should('contain', 'Folder name cannot be blank');
  });

  it.skip('Create Folder Network Error Check', () => {
    PatientMessageCustomFolderPage.loadFoldersList();
    folderPage.createANewFolderButton().click();
    const createFolderName = 'create folder test';
    folderPage
      .createFolderTextBox()
      .type(createFolderName, { waitforanimations: true, force: true });
    cy.intercept('POST', '/my_health/v1/messaging/folder', {
      statusCode: 400,
      body: {
        alertType: 'error',
        header: 'err.title',
        content: 'err.detail',
        response: {
          header: 'err.title',
          content: 'err.detail',
        },
      },
    }).as('folder');
    folderPage.createFolderModalButton().click();
    folderPage.verifyCreateFolderNetworkFailureMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it.skip('Create Folder Input Field Error check on blank value submit', () => {
    PatientMessageCustomFolderPage.loadFoldersList();
    cy.get('[data-testid="create-new-folder"]').click();

    cy.get('[data-testid="folder-name"]')
      .shadow()
      .find('input')
      .click();
    cy.get('[data-testid="folder-name"]')
      .shadow()
      .find('input')
      .should('be.focused');
    cy.realPress(['Enter']);
    cy.realPress(['Tab']);
    cy.realPress(['Enter']);
    cy.get('[data-testid="folder-name"]')
      .shadow()
      .find('#input-error-message')
      .should('contain', 'Folder name cannot be blank');
  });
});
