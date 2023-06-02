import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import MockFoldersResponse from './fixtures/folder-response.json';
import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomFolderNoMessages from './fixtures/empty-thread-response.json';

describe('Secure Messaging Manage Folder AXE check', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Create Folder Success Check', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    FolderManagementPage.createANewFolderButton().click();
    const createFolderName = 'create folder test';
    FolderManagementPage.createFolderTextBox().type(createFolderName, {
      force: true,
    });
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders',
      MockCustomFolderResponse,
    ).as('createFolder');
    FolderManagementPage.createFolderModalButton().click();
    cy.wait('@createFolder');
    FolderManagementPage.verifyCreateFolderSuccessMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Check Delete Folder Success', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    const folderName = MockFoldersResponse.data.at(4).attributes.name;
    const { folderId } = MockFoldersResponse.data.at(4).attributes;

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderId}`, {
      statusCode: 204,
    }).as('deleteFolder');
    FolderManagementPage.clickAndLoadCustumFolder(
      folderName,
      folderId,
      MockCustomFolderResponse,
      mockCustomFolderNoMessages,
    );
    cy.get('[data-testid="remove-folder-button"]').click();
    cy.get('[text="Remove"]')
      .shadow()
      .find('[type="button"]')
      .click();
    FolderManagementPage.verifyDeleteSuccessMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});
