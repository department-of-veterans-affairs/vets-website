import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import PatientMessageCustomFolderPage from '../pages/PatientMessageCustomFolderPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Custom Folder filter-sort checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadFolders();
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
    PatientMessageCustomFolderPage.inputFilterDataText('any');
    PatientMessageCustomFolderPage.clickFilterMessagesButton();
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
