import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import mockParentMessageDetails from './fixtures/message-specialCharacter-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Message Details', () => {
  const detailsPage = new PatientMessageDetailsPage();
  const messageDetails = mockMessageDetails;
  const date = new Date();

  before('Axe Check Message Details Page', () => {
    SecureMessagingSite.login();
    date.setDate(date.getDate() - 2);
    messageDetails.data.attributes.sentDate = date.toISOString();
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    PatientInboxPage.loadInboxMessages(inboxMessages, messageDetails);
    detailsPage.loadMessageDetails(
      messageDetails,
      defaultMockThread,
      1,
      mockParentMessageDetails,
    );
  });

  it('Expanded All Messages Contain all details without additional calls', () => {
    // const updatedMockThread = detailsPage.getCurrentThread();
    detailsPage.verifyExpandedMessageTo(mockParentMessageDetails, 0);

    detailsPage.expandAllThreadMessages();

    detailsPage.verifyExpandedThreadBody(defaultMockThread, 2);
    detailsPage.verifyExpandedThreadAttachment(defaultMockThread, 2);
    cy.get('@allMessageDetails.all').should('have.length', 0);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
