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
    PatientMessageCustomFolderPage.verifyFolderHeader();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientMessageCustomFolderPage.verifyResponseBodyLength();
  });

  it('Check sorting works properly', () => {
    PatientMessageCustomFolderPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });

  it('Verify Filter btn exists', () => {
    PatientMessageCustomFolderPage.VerifyFilterBtnExist();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
