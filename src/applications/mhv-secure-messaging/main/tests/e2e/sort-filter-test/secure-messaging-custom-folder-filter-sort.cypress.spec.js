import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Custom Folder AXE Check', () => {
  beforeEach(() => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    PatientMessageCustomFolderPage.loadFoldersList();
    PatientMessageCustomFolderPage.loadMessages();
  });

  it('verify filter works correctly', () => {
    PatientMessageCustomFolderPage.inputFilterDataText('test');
    PatientMessageCustomFolderPage.clickFilterMessagesButton();
    PatientMessageCustomFolderPage.verifyFilterResultsText('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    // PatientMessageCustomFolderPage.inputFilterDataText('any');
    // PatientMessageCustomFolderPage.clickFilterMessagesButton();
    PatientMessageCustomFolderPage.clickClearFilterButton();
    PatientMessageCustomFolderPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    PatientMessageCustomFolderPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
