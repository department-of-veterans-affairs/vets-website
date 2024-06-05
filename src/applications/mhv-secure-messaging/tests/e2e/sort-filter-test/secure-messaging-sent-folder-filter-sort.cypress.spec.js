import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessagesSentPage from '../pages/PatientMessageSentPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Message Details in Sent AXE Check', () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages();
    FolderLoadPage.loadSentMessages();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify filter works correctly', () => {
    PatientMessagesSentPage.inputFilterDataText('test');
    PatientMessagesSentPage.clickFilterMessagesButton();
    PatientMessagesSentPage.verifyFilterResults('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessagesSentPage.inputFilterDataText('any');
    PatientMessagesSentPage.clickFilterMessagesButton();
    PatientMessagesSentPage.clickClearFilterButton();
    PatientMessagesSentPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    PatientMessagesSentPage.verifySorting();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
