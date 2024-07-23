import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('manage folders', () => {
  describe('verify folder created', () => {
    const newFolder = `folder${Date.now()}`;

    before(() => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
    });

    it('verify message and focus', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {});

      PatientMessageCustomFolderPage.createCustomFolder(newFolder);
      FolderManagementPage.verifyCreateFolderSuccessMessage();
      FolderManagementPage.verifyCreateFolderSuccessMessageHasFocus();
    });
  });

  describe('verify folder deleted', () => {
    const folderName = createdFolderResponse.data.attributes.name;
    const { folderId } = createdFolderResponse.data.attributes;

    before(() => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
    });

    it('verify message and focus', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {});

      PatientMessageCustomFolderPage.loadSingleFolderWithNoMessages(
        folderId,
        folderName,
      );
      FolderManagementPage.deleteFolderButton().click();
      FolderManagementPage.confirmDeleteFolder(folderId);
      FolderManagementPage.verifyDeleteSuccessMessageText();
      FolderManagementPage.verifyDeleteSuccessMessageHasFocus();
    });
  });
});
