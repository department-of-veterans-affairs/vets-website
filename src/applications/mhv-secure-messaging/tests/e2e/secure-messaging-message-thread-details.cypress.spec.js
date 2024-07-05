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
  let messageDetails = mockMessageDetails;
  const date = new Date();

  before('Axe Check Message Details Page', () => {
    SecureMessagingSite.login();
    date.setDate(date.getDate() - 2);
    messageDetails = {
      data: {
        ...mockMessageDetails.data,
        attributes: {
          ...mockMessageDetails.data.attributes,
          sentDate: date.toISOString(),
        },
      },
    };
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    PatientInboxPage.loadInboxMessages(inboxMessages, messageDetails);
    detailsPage.loadMessageDetails(
      messageDetails,
      defaultMockThread,
      1,
      mockParentMessageDetails,
    );
  });

  it('Has correct behavior when expanding one child thread message', () => {
    const updatedMockThread = detailsPage.getCurrentThread();
    detailsPage.expandThreadMessageDetails(updatedMockThread, 1);
    detailsPage.verifyExpandedMessageTo(mockParentMessageDetails, 1);
    detailsPage.verifyExpandedMessageFrom(messageDetails);
    detailsPage.verifyExpandedMessageId(messageDetails);
    detailsPage.verifyExpandedMessageDate(mockParentMessageDetails, 1);

    detailsPage.verifyUnexpandedMessageAttachment(2);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
