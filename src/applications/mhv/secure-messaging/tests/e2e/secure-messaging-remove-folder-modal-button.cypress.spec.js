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
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      PatientMessageCustomFolderPage.createCustomFolder(newFolder);

      folderPage.verifyCreateFolderSuccessMessage();
    });
  });

  describe('Remove Modal Folder button message', () => {
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

    it('Verify Modal Should Appear', () => {
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });

      PatientMessageCustomFolderPage.loadSingleFolderWithMessages(
        folderId,
        folderName,
      );
      folderPage.deleteFolderButton().click();

      cy.get('[data-testid="error-folder-not-empty"]').click({
        waitForAnimations: true,
        force: true,
      });
      cy.get('.modal')
        .contains(
          "You can't remove a folder with messages in it. Move all the messages to another folder. Then try removing it again.",
        )
        .click();

      cy.get('[text="Ok"]')
        .shadow()
        .find('[type="button"]')
        .click();
    });
  });
});
