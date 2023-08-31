import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import MockFoldersResponse from './fixtures/folder-response.json';
import MockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomFolderNoMessages from './fixtures/empty-thread-response.json';

describe('Secure Messaging Manage Folder AXE check', () => {
  const folderPage = new FolderManagementPage();
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
  });
  it('Create Folder Success Check', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    folderPage.createANewFolderButton().click();
    const createFolderName = 'create folder test';
    folderPage.createFolderTextBox().type(createFolderName, { force: true });
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders',
      MockCustomFolderResponse,
    ).as('createFolder');
    folderPage.createFolderModalButton().click();
    cy.wait('@createFolder');
    folderPage.verifyCreateFolderSuccessMessage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
  it('Check Delete Folder Success', () => {
    cy.get('[data-testid="my-folders-sidebar"]').click();
    const folderName = MockFoldersResponse.data.at(4).attributes.name;
    const { folderId } = MockFoldersResponse.data.at(4).attributes;

    cy.intercept('DELETE', `/my_health/v1/messaging/folders/${folderId}`, {
      statusCode: 204,
    }).as('deleteFolder');
    folderPage.clickAndLoadCustomFolder(
      folderName,
      folderId,
      MockCustomFolderResponse,
      mockCustomFolderNoMessages,
    );
    cy.get('[data-testid="remove-folder-button"]').click();
    cy.get('[text="Yes, remove this folder"]')
      .shadow()
      .find('[type="button"]')
      .click();
    folderPage.verifyDeleteSuccessMessage();
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
