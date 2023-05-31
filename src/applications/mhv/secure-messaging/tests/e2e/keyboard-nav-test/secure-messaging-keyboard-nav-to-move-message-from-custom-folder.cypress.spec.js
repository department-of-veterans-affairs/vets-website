import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderManagementPage from '../pages/FolderManagementPage';
import mockCustomFolderResponse from '../fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from '../fixtures/message-custom-response.json';
import mockFoldersResponse from '../fixtures/folder-response.json';
import mockCustomDetails from '../fixtures/custom-response.json';

describe('Secure Messaging Keyboard Nav Move Message from CustomFolder', () => {
  it('move message', () => {
    const folderName = mockFoldersResponse.data.at(4).attributes.name;
    const { folderId } = mockFoldersResponse.data.at(4).attributes;
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.get('[data-testid ="my-folders-sidebar"]').click();

    FolderManagementPage.clickAndLoadCustumFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockCustomMessagesResponse,
    );
    FolderManagementPage.loadCustomFolderMessageDetails(mockCustomDetails);
    FolderManagementPage.selectFolderfromModal();
    FolderManagementPage.moveCustomFolderMessageToDifferentFolder();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationFocus();
    cy.injectAxe();
    cy.axeCheck();
  });
});
