import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageSentPage from '../pages/PatientMessageSentPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';
import mockSentMessages from '../fixtures/sentResponse/sent-messages-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientFilterPage from '../pages/PatientFilterPage';

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

  it('verify filter works correctly', () => {
    GeneralFunctionsPage.verifyHeaderFocused();
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData, -1);
    PatientFilterPage.verifyFilterResults('test', filteredData);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify clear filter btn works correctly', () => {
    PatientFilterPage.inputFilterDataByKeyboard('test');
    PatientFilterPage.submitFilterByKeyboard(filteredData, -1);
    PatientFilterPage.clearFilterByKeyboard();
    PatientFilterPage.verifyFilterFieldCleared();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sorting works properly', () => {
    const sortedResult = PatientFilterPage.sortMessagesThread(mockSentMessages);

    PatientFilterPage.verifySortingByKeyboard(sortedResult);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
