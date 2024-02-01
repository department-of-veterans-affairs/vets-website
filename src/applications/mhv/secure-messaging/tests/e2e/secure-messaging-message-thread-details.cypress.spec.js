import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import mockParentMessageDetails from './fixtures/message-specialCharacter-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    const date = new Date();
    date.setDate(date.getDate() - 2);
    const messageDetails = {
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
    const updatedMockThread = detailsPage.getCurrentThread();
    detailsPage.expandThreadMessageDetails(updatedMockThread, 1);
    cy.reload(true);
    detailsPage.verifyExpandedMessageToDisplay(mockParentMessageDetails);
    // detailsPage.verifyExpandedMessageFromDisplay(mockParentMessageDetails); // TODO need to check the logic on displaying triage grop name only on received messages
    // detailsPage.verifyExpandedMessageIDDisplay(mockParentMessageDetails); //TODO UCD is still determining whether to display this
    detailsPage.verifyExpandedMessageDateDisplay(messageDetails);
    // detailsPage.verifyUnexpandedMessageAttachment(1); //TODO attachment icons will be added in a future story
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
