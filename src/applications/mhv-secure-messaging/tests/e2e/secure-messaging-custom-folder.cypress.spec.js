import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageCustomFolderPage from './pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Custom Folder AXE Check', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('Verify folder header', () => {
    PatientMessageCustomFolderPage.verifyFolderHeaderText();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.verifyResponseBodyLength();
  });

  it('Verify Filter btn exists', () => {
    PatientMessageCustomFolderPage.VerifyFilterBtnExist();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('Verify Remove folder btn exists and click on x button on pop-up', () => {
    PatientMessageCustomFolderPage.verifyRemoveFolder();
    PatientMessageCustomFolderPage.tabAndPressToRemoveFolderButton();
    PatientMessageCustomFolderPage.verifyEmptyFolderText();
    PatientMessageCustomFolderPage.verifyFocusToCloseIcon();
    PatientMessageCustomFolderPage.clickOnCloseIcon();
    PatientMessageCustomFolderPage.verifyFocusOnRemoveFolderButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
