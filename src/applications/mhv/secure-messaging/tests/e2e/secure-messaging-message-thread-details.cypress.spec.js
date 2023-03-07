import moment from 'moment-timezone';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = mockMessageDetails;
    // const messageDetails = landingPage.setMessageDateToYesterday(mockMessageDetails);
    const date = new Date();
    date.setDate(date.getDate() - 2);
    messageDetails.data.attributes.sentDate = date.toISOString();
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    landingPage.loadInboxMessages(inboxMessages, messageDetails);
    detailsPage.loadMessageDetails(messageDetails, defaultMockThread);

    detailsPage.expandThreadMessageDetails(defaultMockThread, 1);
    cy.get('[data-testid="to"]').contains(
      messageDetails.data.attributes.recipientName,
    );

    detailsPage.verifyExpandedMessageToDisplay(messageDetails);

    const timeZone = moment.tz.guess();
    cy.get('[data-testid="message-id"]')
      .eq(0)
      .should(
        'have.text',
        `Message ID: ${messageDetails.data.attributes.messageId}`,
      );
    cy.get('[data-testid="message-date"]')
      .eq(0)
      .should(
        'have.text',
        moment
          .tz(messageDetails.data.attributes.sentDate, timeZone)
          .format('MMMM D, YYYY [at] h:mm a z'),
      );

    // verify To: Displayed
    // verify Message Displayed
    // Verify Body is complete
    cy.injectAxe();
    cy.axeCheck();
  });
});
