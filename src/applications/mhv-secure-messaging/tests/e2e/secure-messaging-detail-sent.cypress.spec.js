import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';
import inboxMessages from './fixtures/messages-response.json';
// import mockMessageDetails from './fixtures/message-response.json';
// import defaultMockThread from './fixtures/thread-response.json';
// import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM SENT MESSAGE DETAILS', () => {
  it('verify sent message details', () => {
    SecureMessagingSite.login();
    // const messageDetails = mockMessageDetails;
    // // const messageDetails = landingPage.setMessageDateToYesterday(mockMessageDetails);
    // const date = new Date();
    // date.setDate(date.getDate() - 2);
    // messageDetails.data.attributes.sentDate = date.toISOString();
    // cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);

    PatientInboxPage.loadInboxMessages(inboxMessages);
    PatientMessageSentPage.loadMessages();

    // PatientMessageDetailsPage.loadMessageDetails(
    //   messageDetails,
    //   defaultMockThread,
    //   0,
    // );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
