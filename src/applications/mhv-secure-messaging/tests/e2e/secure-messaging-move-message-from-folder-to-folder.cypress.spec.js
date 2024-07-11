import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import mockCustomFolderResponse from './fixtures/folder-custom-metadata.json';
import mockCustomMessagesResponse from './fixtures/message-custom-response.json';
import mockFoldersResponse from './fixtures/folder-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import { AXE_CONTEXT } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('Secure Messaging Move Message tests', () => {
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
    FolderManagementPage.moveCustomFolderMessageToDifferentFolder();

    FolderManagementPage.verifyMoveMessageSuccessConfirmationMessage();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('move message from inbox to deleted', () => {
    const messageDetailsPage = new PatientMessageDetailsPage();
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    messageDetailsPage.loadMessageDetails(mockMessagewithAttachment);

    FolderManagementPage.moveInboxFolderMessageToDifferentFolder();

    FolderManagementPage.verifyMoveMessageSuccessConfirmationMessage();
    FolderManagementPage.verifyMoveMessageSuccessConfirmationHasFocus();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
