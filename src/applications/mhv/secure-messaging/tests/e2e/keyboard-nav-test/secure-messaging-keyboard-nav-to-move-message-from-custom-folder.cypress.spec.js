import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderManagementPage from '../pages/FolderManagementPage';
import mockCustomFolderResponse from '../fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from '../fixtures/message-custom-response.json';
import mockFoldersResponse from '../fixtures/folder-response.json';
import mockCustomDetails from '../fixtures/custom-response.json';

describe('Secure Messaging Keyboard Nav Move Message from CustomFolder', () => {
  it('move message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const folderPage = new FolderManagementPage();
    const folderName = mockFoldersResponse.data.at(4).attributes.name;
    const { folderId } = mockFoldersResponse.data.at(4).attributes;
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[data-testid ="my-folders-sidebar"]').click();

    folderPage.clickAndLoadCustumFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockCustomMessagesResponse,
    );
    folderPage.loadCustomFolderMessageDetails(mockCustomDetails);
    folderPage.selectFolderfromModal();
    folderPage.moveCustomFolderMessageToDifferentFolder();
    folderPage.verifyMoveMessageSuccessConfirmationFocus();
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
