import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';
import FolderLoadPage from './pages/FolderLoadPage';

describe('Secure Messaging Custom Folder AXE Check', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('verify folder header', () => {
    PatientMessageCustomFolderPage.verifyFolderHeaderText();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientMessageCustomFolderPage.verifyResponseBodyLength();
  });

  it('verify main buttons', () => {
    PatientMessageCustomFolderPage.verifyMainButtons();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify remove non-empty folder', () => {
    PatientMessageCustomFolderPage.tabAndPressToRemoveFolderButton();
    PatientMessageCustomFolderPage.verifyEmptyFolderAlert();
    PatientMessageCustomFolderPage.clickOnCloseIcon();
    PatientMessageCustomFolderPage.verifyFocusOnRemoveFolderButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
