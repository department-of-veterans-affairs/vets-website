import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging Message Details in Sent AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    SecureMessagingSite.login();
    // const messageDetails = mockMessageDetails;
    // const messageDetails = landingPage.setMessageDateToYesterday(mockMessageDetails);
    const date = new Date();
    date.setDate(date.getDate() - 2);
    mockMessageDetails.data.attributes.sentDate = date.toISOString();
    cy.log(`New Message Details ==== ${JSON.stringify(mockMessageDetails)}`);
    PatientInboxPage.loadInboxMessages(inboxMessages, mockMessageDetails);
    PatientMessageDetailsPage.loadMessageDetails(
      mockMessageDetails,
      defaultMockThread,
      0,
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
