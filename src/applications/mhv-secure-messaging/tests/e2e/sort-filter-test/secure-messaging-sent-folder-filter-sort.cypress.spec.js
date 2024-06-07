import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessagesSentPage from '../pages/PatientMessageSentPage';
import FolderLoadPage from '../pages/FolderLoadPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Trash Folder filter-sort checks', () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
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
    FolderLoadPage.loadSentMessages(mockSentMessages);
    const sortedResponse = {
      ...mockSentMessages,
      data: [...mockSentMessages.data].sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessagesSentPage.verifySorting('Oldest to newest', sortedResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
