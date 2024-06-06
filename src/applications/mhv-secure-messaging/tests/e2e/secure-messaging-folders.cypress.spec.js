import manifest from '../../manifest.json';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT } from './utils/constants';
import PatientInboxPage from './pages/PatientInboxPage';

describe(manifest.appName, () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Check the Inbox folder', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Inbox');
    FolderLoadPage.verifyBreadCrumbsLength(4);
    FolderLoadPage.backToFolder('Messages');
  });

  it('Check the Draft folder', () => {
    FolderLoadPage.loadDraftMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Drafts');
    FolderLoadPage.verifyBreadCrumbsLength(4);
    FolderLoadPage.backToFolder('Messages');
  });

  it('Check the Sent folder', () => {
    FolderLoadPage.loadSentMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Sent');
    FolderLoadPage.verifyBreadCrumbsLength(4);
    FolderLoadPage.backToFolder('Messages');
  });

  it('Check the Trash folder', () => {
    FolderLoadPage.loadDeletedMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    FolderLoadPage.verifyFolderHeaderText('Trash');
    FolderLoadPage.verifyBreadCrumbsLength(4);
    FolderLoadPage.backToFolder('Messages');
  });
});
