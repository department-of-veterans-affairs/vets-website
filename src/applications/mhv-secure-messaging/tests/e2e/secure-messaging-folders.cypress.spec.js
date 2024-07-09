import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientInboxPage from './pages/PatientInboxPage';
import PatentMessageSentPage from './pages/PatientMessageSentPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Check the Inbox folder', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Inbox');
    FolderLoadPage.verifyBreadCrumbsLength(4);
  });

  it('Check the Draft folder', () => {
    FolderLoadPage.loadDraftMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Drafts');
    FolderLoadPage.verifyBreadCrumbsLength(4);
  });

  it('Check the Sent folder', () => {
    PatentMessageSentPage.loadMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Sent');
    FolderLoadPage.verifyBreadCrumbsLength(4);
  });

  it('Check the Trash folder', () => {
    FolderLoadPage.loadDeletedMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Trash');
    FolderLoadPage.verifyBreadCrumbsLength(4);
  });

  // afterEach(() => {
  //   FolderLoadPage.backToFolder('Messages');
  // });
});
