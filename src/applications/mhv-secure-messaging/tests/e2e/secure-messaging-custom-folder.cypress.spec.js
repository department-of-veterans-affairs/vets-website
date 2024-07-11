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

  it('Verify folder header', () => {
    PatientMessageCustomFolderPage.verifyFolderHeaderText();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
    PatientMessageCustomFolderPage.verifyResponseBodyLength();
  });

  it('Verify Filter btn exists', () => {
    PatientMessageCustomFolderPage.VerifyFilterBtnExist();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify Remove Non-empty Folder', () => {
    PatientMessageCustomFolderPage.tabAndPressToRemoveFolderButton();
    PatientMessageCustomFolderPage.verifyEmptyFolderAlert();
    PatientMessageCustomFolderPage.verifyFocusToCloseIcon();
    PatientMessageCustomFolderPage.clickOnCloseIcon();
    PatientMessageCustomFolderPage.verifyFocusOnRemoveFolderButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
