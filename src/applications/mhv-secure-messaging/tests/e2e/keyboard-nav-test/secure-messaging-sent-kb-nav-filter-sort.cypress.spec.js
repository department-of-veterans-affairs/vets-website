import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';

describe('Sent page keyboard navigation for filter & sort features', () => {
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockSentMessages);
    PatientMessageSentPage.loadMessages();
  });

  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageSentPage.inputFilterDataByKeyboard('test');
    PatientMessageSentPage.submitFilterByKeyboard(filteredData, -1);
    PatientMessageSentPage.verifyFilterResults('test', filteredData);
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientMessageSentPage.inputFilterDataByKeyboard('test');
    PatientMessageSentPage.submitFilterByKeyboard(filteredData, -1);
    PatientMessageSentPage.clearFilterByKeyboard();
    PatientMessageSentPage.verifyFilterFieldCleared();
  });

  it('verify sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    const testData = {
      data: Array.from(mockSentMessages.data).sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientMessageSentPage.verifySortingByKeyboard(
      'Oldest to newest',
      testData,
      -1,
    );
  });
});
