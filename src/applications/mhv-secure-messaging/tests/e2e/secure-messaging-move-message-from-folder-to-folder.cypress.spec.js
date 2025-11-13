import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from './fixtures/message-custom-response.json';
import mockFoldersResponse from './fixtures/folder-response.json';
import mockMessages from './fixtures/threads-response.json';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import { AXE_CONTEXT } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('Secure Messaging Move Message to Folder tests', () => {
  it('move message from custom folder to Deleted', () => {
    const folderName = mockFoldersResponse.data.at(4).attributes.name;
    const { folderId } = mockFoldersResponse.data.at(4).attributes;
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();

    FolderManagementPage.clickAndLoadCustomFolder(
      folderName,
      folderId,
      mockCustomFolderResponse,
      mockMessages,
    );

    PatientInboxPage.loadSingleThread(mockCustomMessagesResponse);

    FolderManagementPage.selectFolderFromModal();
    FolderManagementPage.confirmMovingMessageToFolder();

    FolderManagementPage.verifyMoveMessageSuccessConfirmationMessage();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('move message from inbox to deleted', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    PatientInboxPage.loadSingleThread(mockCustomMessagesResponse);

    FolderManagementPage.selectFolderFromModal();
    FolderManagementPage.confirmMovingMessageToFolder();

    FolderManagementPage.verifyMoveMessageSuccessConfirmationMessage();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
