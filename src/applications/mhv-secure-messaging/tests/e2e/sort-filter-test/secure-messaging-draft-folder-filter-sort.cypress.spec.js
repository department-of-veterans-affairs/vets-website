import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';

describe('Secure Messaging Draft Folder filter-sort checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
    FolderLoadPage.loadDraftMessages();
  });

  it('Verify filter works correctly', () => {
    PatientMessageDraftsPage.inputFilterDataText('test');
    PatientMessageDraftsPage.clickFilterMessagesButton();
    PatientMessageDraftsPage.verifyFilterResultsText('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessageDraftsPage.inputFilterDataText('any');
    PatientMessageDraftsPage.clickFilterMessagesButton();
    PatientMessageDraftsPage.clickClearFilterButton();
    PatientMessageDraftsPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    PatientMessageDraftsPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
