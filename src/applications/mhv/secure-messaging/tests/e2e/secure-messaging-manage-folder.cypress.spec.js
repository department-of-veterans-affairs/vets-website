import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
// import MockFoldersResponse from './fixtures/folder-response.json';
// import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
// import mockCustomFolderNoMessages from './fixtures/empty-thread-response.json';
import createdFolderResponse from './fixtures/customResponse/ctreated-folder-response.json';
import foldersList from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Secure Messaging Manage Folder AXE check', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const newFolder = `folder${Date.now()}`;
  foldersList.data.push(createdFolderResponse.data);

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
  });
  it('Create Folder Success Check', () => {
    PatientMessageCustomFolderPage.loadFoldersList();
    folderPage.createANewFolderButton().click();
    folderPage.createFolderTextBox().type(newFolder, { force: true });
    cy.intercept(
      'POST',
      Paths.SM_API_BASE + Paths.FOLDERS,
      createdFolderResponse,
    ).as('createFolder');
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}?*`,
      foldersList,
    ).as('updatedFoldersList');

    folderPage.createFolderModalButton().click();
    folderPage.verifyCreateFolderSuccessMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it.skip('Check Delete Folder Success', () => {
    PatientMessageCustomFolderPage.loadFoldersList();
    const folderName = createdFolderResponse.data.attributes.name;
    const { folderId } = createdFolderResponse.data.attributes;
    const folderWithoutMessages = {
      errors: [
        {
          title: 'Operation failed',
          detail: 'No messages in the requested folder',
          code: 'VA900',
          status: '400',
        },
      ],
    };

    // intercept loading folder without messages
    cy.intercept;
    folderPage.clickAndLoadCustomFolder(
      folderName,
      folderId,
      createdFolderResponse,
      folderWithoutMessages,
    );

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderId}`, {
      statusCode: 204,
    }).as('deleteFolder');
    folderPage.deleteFolder();

    folderPage.verifyDeleteSuccessMessage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
