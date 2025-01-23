import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Trash Folder filter-sort checks', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
    PatientMessageSentPage.loadMessages();
  });

  it('Verify filter works correctly', () => {
    PatientMessageSentPage.inputFilterDataText('test');
    PatientMessageSentPage.clickFilterMessagesButton();
    PatientMessageSentPage.verifyFilterResults('test');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessageSentPage.inputFilterDataText('any');
    PatientMessageSentPage.clickFilterMessagesButton();
    PatientMessageSentPage.clickClearFilterButton();
    PatientMessageSentPage.verifyFilterFieldCleared();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Check sorting works properly', () => {
    PatientMessageSentPage.loadMessages();
    const sortedResponse = {
      ...mockSentMessages,
      data: [...mockSentMessages.data].sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessageSentPage.verifySorting('Oldest to newest', sortedResponse);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
