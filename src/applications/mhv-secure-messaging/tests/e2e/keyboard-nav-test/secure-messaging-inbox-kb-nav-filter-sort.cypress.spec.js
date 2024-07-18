import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import inboxFilterResponse from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Inbox page keyboard navigation for filter & sort features', () => {
  const filteredData = {
    data: inboxFilterResponse.data.filter(item =>
      item.attributes.subject.toLowerCase().includes('test'),
    ),
  };

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });

  it('Verify filter works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInboxPage.inputFilterDataByKeyboard('test');
    PatientInboxPage.submitFilterByKeyboard(filteredData, 0);
    PatientInboxPage.verifyFilterResults('test', filteredData);
  });

  it('Verify clear filter btn works correctly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInboxPage.inputFilterDataByKeyboard('test');
    PatientInboxPage.submitFilterByKeyboard(filteredData, 0);
    PatientInboxPage.clearFilterByKeyboard();
    PatientInboxPage.verifyFilterFieldCleared();
  });

  it('verify sorting works properly', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    const testData = {
      data: Array.from(inboxFilterResponse.data).sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PatientInboxPage.verifySortingByKeyboard('Oldest to newest', testData, 0);
  });
});
