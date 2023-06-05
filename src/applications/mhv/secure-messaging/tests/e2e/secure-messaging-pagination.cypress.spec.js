import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessagesPageOne from './fixtures/messages-response.json';
import mockMessagesPageTwo from './fixtures/messages-response-page-2.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    SecureMessagingSite.login();
    const threadLength = 28;
    mockMessagesPageOne.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    mockMessagesPageTwo.data.forEach(item => {
      const currentItem = item;
      currentItem.attributes.threadPageSize = threadLength;
    });
    PatientInboxPage.loadInboxMessages(mockMessagesPageOne);
    SecureMessagingSite.loadVAPaginationNextMessages(2, mockMessagesPageTwo);
    SecureMessagingSite.verifyPaginationMessagesDisplayed(11, 20, threadLength);
    SecureMessagingSite.loadVAPaginationPreviousMessages(
      1,
      mockMessagesPageOne,
    );
    SecureMessagingSite.verifyPaginationMessagesDisplayed(1, 10, threadLength);
    SecureMessagingSite.loadVAPaginationPageMessages(1, mockMessagesPageOne);
    SecureMessagingSite.verifyPaginationMessagesDisplayed(1, 10, threadLength);
    SecureMessagingSite.loadVAPaginationPageMessages(2, mockMessagesPageTwo);
    SecureMessagingSite.verifyPaginationMessagesDisplayed(11, 20, threadLength);

    cy.injectAxe();
    cy.axeCheck();
  });
});
