import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('manage folders', () => {
  describe('folder created message', () => {
    const site = new SecureMessagingSite();
    const newFolder = `folder${Date.now()}`;

    before(() => {
      site.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
    });

    it('verify folder created', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {});

      PatientMessageCustomFolderPage.createCustomFolder(newFolder);
      FolderManagementPage.verifyCreateFolderSuccessMessage();
      FolderManagementPage.verifyCreateFolderSuccessMessageHasFocus();
    });
  });

  describe('folder deleted message', () => {
    const site = new SecureMessagingSite();
    const folderName = createdFolderResponse.data.attributes.name;
    const { folderId } = createdFolderResponse.data.attributes;

    before(() => {
      site.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
    });

    it('verify folder deleted', () => {
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
