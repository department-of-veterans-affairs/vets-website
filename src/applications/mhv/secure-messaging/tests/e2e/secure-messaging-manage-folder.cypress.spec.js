import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
// import MockFoldersResponse from './fixtures/folder-response.json';
// import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
// import mockCustomFolderNoMessages from './fixtures/empty-thread-response.json';
import createdFolderResponse from './fixtures/customResponse/ctreated-folder-response.json';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Manage Folder AXE check', () => {
  const folderPage = new FolderManagementPage();
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const newFolder = `folder${Date.now()}`;
  mockFolders.data.push(createdFolderResponse.data);

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
  });
  it('Create Folder Success Check', () => {
    PatientMessageCustomFolderPage.createCustomFolder(newFolder);
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
    const folderName = createdFolderResponse.data.attributes.name;
    // const folderId = createdFolderResponse.data.attributes;

    cy.contains(folderName).click({ waitForAnimations: true });

    // PatientMessageCustomFolderPage.loadSingleFolder(200, folderId, folderName);
    // const folderWithoutMessages = {
    //   errors: [
    //     {
    //       title: 'Operation failed',
    //       detail: 'No messages in the requested folder',
    //       code: 'VA900',
    //       status: '400',
    //     },
    //   ],
    // };

    // cy.intercept(
    //   'GET',
    //   `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/threads?*`,
    //   createdFolderResponse,
    // ).as('singleFolderThread');

    // cy.contains(folderName).click();
    // folderPage.clickAndLoadCustomFolder(
    //   folderName,
    //   folderId,
    //   createdFolderResponse,
    //   folderWithoutMessages,
    // );

    // cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderId}`, {
    //   statusCode: 204,
    // }).as('deleteFolder');
    // folderPage.deleteFolder();

    // folderPage.verifyDeleteSuccessMessage();
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
