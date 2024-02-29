import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import mockParentMessageDetails from './fixtures/message-specialCharacter-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Message Details', () => {
  const landingPage = new PatientInboxPage();
  const detailsPage = new PatientMessageDetailsPage();
  const site = new SecureMessagingSite();

  let messageDetails = mockMessageDetails;
  const date = new Date();

  before('Axe Check Message Details Page', () => {
    site.login();
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
    landingPage.loadInboxMessages(inboxMessages, messageDetails);
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
    // cy.reload(true);
    detailsPage.verifyExpandedMessageToDisplay(mockParentMessageDetails, 1);
    // detailsPage.verifyExpandedMessageFromDisplay(mockParentMessageDetails); // TODO need to check the logic on displaying triage grop name only on received messages
    // detailsPage.verifyExpandedMessageIDDisplay(mockParentMessageDetails); //TODO UCD is still determining whether to display this
    detailsPage.verifyExpandedMessageDateDisplay(mockParentMessageDetails, 1);
    cy.get('@messageDetails.all').should('have.length', 1);

    // detailsPage.verifyUnexpandedMessageAttachment(1); //TODO attachment icons will be added in a future story
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
