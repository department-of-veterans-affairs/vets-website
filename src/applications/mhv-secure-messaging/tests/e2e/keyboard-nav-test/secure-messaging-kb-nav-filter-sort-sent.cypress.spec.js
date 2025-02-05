import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('SM SENT FILTER & SORT KB NAVIGATION', () => {
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
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientMessageSentPage.inputFilterDataByKeyboard('test');
    PatientMessageSentPage.submitFilterByKeyboard(filteredData, -1);
    PatientMessageSentPage.verifyFilterResults('test', filteredData);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('Verify clear filter btn works correctly', () => {
    PatientMessageSentPage.inputFilterDataByKeyboard('test');
    PatientMessageSentPage.submitFilterByKeyboard(filteredData, -1);
    PatientMessageSentPage.clearFilterByKeyboard();
    PatientMessageSentPage.verifyFilterFieldCleared();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
