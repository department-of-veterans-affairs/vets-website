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

  const messageDetails = mockMessageDetails;
  const date = new Date();

  before('Axe Check Message Details Page', () => {
    site.login();
    date.setDate(date.getDate() - 2);
    messageDetails.data.attributes.sentDate = date.toISOString();
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    landingPage.loadInboxMessages(inboxMessages, messageDetails);
    detailsPage.loadMessageDetails(
      messageDetails,
      defaultMockThread,
      1,
      mockParentMessageDetails,
    );
  });

  it('Expanded All Messages Contain all details without additional calls', () => {
    // const updatedMockThread = detailsPage.getCurrentThread();
    detailsPage.verifyExpandedMessageToDisplay(mockParentMessageDetails, 0);

    detailsPage.expandAllThreadMessages();
    // there should only call to /messages/message/*
    cy.wait('@message1');

    detailsPage.verifyExpandedThreadBodyDisplay(defaultMockThread, 2);
    detailsPage.verifyExpandedThreadAttachmentDisplay(defaultMockThread, 2);
    // detailsPage.verifyUnexpandedMessageAttachment(1); //TODO attachment icons will be added in a future story
    cy.get('@allMessageDetails.all').should('have.length', 0);
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
