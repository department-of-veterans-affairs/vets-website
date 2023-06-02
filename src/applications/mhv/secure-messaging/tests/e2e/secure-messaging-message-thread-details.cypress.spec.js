import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import mockParentMessageDetails from './fixtures/message-specialCharacter-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    SecureMessagingSite.login();
    const date = new Date();
    date.setDate(date.getDate() - 2);
    mockMessageDetails.data.attributes.sentDate = date.toISOString();
    cy.log(`New Message Details ==== ${JSON.stringify(mockMessageDetails)}`);
    PatientInboxPage.loadInboxMessages(inboxMessages, mockMessageDetails);
    PatientMessageDetailsPage.loadMessageDetails(
      mockMessageDetails,
      defaultMockThread,
      1,
      mockParentMessageDetails,
    );
    const updatedMockThread = PatientMessageDetailsPage.getCurrentThread();
    PatientMessageDetailsPage.expandThreadMessageDetails(updatedMockThread, 1);
    cy.reload(true);
    PatientMessageDetailsPage.verifyExpandedMessageToDisplay(
      mockParentMessageDetails,
    );
    PatientMessageDetailsPage.verifyExpandedMessageFromDisplay(
      mockParentMessageDetails,
    );
    // detailsPage.verifyExpandedMessageIDDisplay(mockParentMessageDetails); //TODO UCD is still determining whether to display this
    PatientMessageDetailsPage.verifyExpandedMessageDateDisplay(
      mockParentMessageDetails,
    );
    // detailsPage.verifyUnexpandedMessageAttachment(1); //TODO attachment icons will be added in a future story
    cy.injectAxe();
    cy.axeCheck();
  });
});
