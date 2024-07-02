import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessagesDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';
import FolderLoadPage from '../pages/FolderLoadPage';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';

describe('Secure Messaging Draft Folder filter-sort checks', () => {
  const draftsPage = new PatientMessagesDraftsPage();
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockDraftMessages);
    FolderLoadPage.loadDraftMessages();
  });

  it('Verify filter works correctly', () => {
    draftsPage.inputFilterDataText('test');
    draftsPage.clickFilterMessagesButton();
    draftsPage.verifyFilterResultsText('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    draftsPage.inputFilterDataText('any');
    draftsPage.clickFilterMessagesButton();
    draftsPage.clickClearFilterButton();
    draftsPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    draftsPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
