import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';
import PatientMessageTrashPage from './pages/PatientMessageTrashPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import FolderLoadPage from './pages/FolderLoadPage';
import mockEmptyMessages from './fixtures/empty-thread-response.json';
import mockFolders from './fixtures/folder-response.json';
import createdFolderResponse from './fixtures/customResponse/created-folder-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Empty Folder Alert', () => {
  describe('default folders do not show remove folder alert when empty', () => {
    it('inbox - no remove folder alert', () => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages(mockEmptyMessages);

      cy.get(Locators.NO_MESS).should('not.exist');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });

    it('sent folder - no remove folder alert', () => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      PatientMessageSentPage.loadMessages(mockEmptyMessages);

      cy.get(Locators.NO_MESS).should('not.exist');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('drafts folder - no remove folder alert', () => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      PatientMessageDraftsPage.loadDrafts(mockEmptyMessages);

      cy.get(Locators.NO_MESS).should('not.exist');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });

    it('trash folder - no remove folder alert', () => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      PatientMessageTrashPage.loadMessages(mockEmptyMessages);

      cy.get(Locators.NO_MESS).should('not.exist');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });

  describe('custom folders show remove folder alert when empty', () => {
    const updatedFolders = {
      ...mockFolders,
      data: [...mockFolders.data, createdFolderResponse.data],
    };

    it('custom folder - shows remove folder alert', () => {
      SecureMessagingSite.login();
      PatientInboxPage.loadInboxMessages();
      FolderLoadPage.loadFolders();
      PatientMessageCustomFolderPage.createCustomFolder(updatedFolders);
      PatientMessageCustomFolderPage.loadCustomFolderWithNoMessages();

      cy.findByText(Data.NO_MSG_IN_FOLDER).should('be.visible');
      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT);
    });
  });
});
