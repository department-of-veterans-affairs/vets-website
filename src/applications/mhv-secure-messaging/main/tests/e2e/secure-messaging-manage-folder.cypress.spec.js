import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import FolderManagementPage from './pages/FolderManagementPage';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import mockFolders from './fixtures/generalResponses/folders.json';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('manage folders', () => {
  describe('folder created message', () => {
    const folderPage = new FolderManagementPage();
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const newFolder = `folder${Date.now()}`;

    before(() => {
      site.login();
      landingPage.loadInboxMessages();
      PatientMessageCustomFolderPage.loadFoldersList();
    });

    it('verify folder created', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {});

      PatientMessageCustomFolderPage.createCustomFolder(newFolder);
      folderPage.verifyCreateFolderSuccessMessage();
      folderPage.verifyCreateFolderSucessMessageHasFocus();
    });
  });

  describe('folder deleted message', () => {
    const folderPage = new FolderManagementPage();
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const folderName = createdFolderResponse.data.attributes.name;
    const { folderId } = createdFolderResponse.data.attributes;

    before(() => {
      site.login();
      landingPage.loadInboxMessages();
      PatientMessageCustomFolderPage.loadFoldersList(mockFolders);
    });

    it('verify folder deleted', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {});

      PatientMessageCustomFolderPage.loadSingleFolderWithNoMessages(
        folderId,
        folderName,
      );
      folderPage.deleteFolderButton().click();
      folderPage.confirmDeleteFolder(folderId);
      folderPage.verifyDeleteSuccessMessage();
      folderPage.verifyDeleteSuccessMessageHasFocus();
    });
  });
});
