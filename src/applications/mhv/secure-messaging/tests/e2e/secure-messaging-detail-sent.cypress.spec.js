import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientSentPage from './pages/PatientSentPage';
import mockMessageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import sentMessages from './fixtures/messages-sent-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging Message Details in Sent AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();
    const sentPage = new PatientSentPage();
    const site = new SecureMessagingSite();
    site.login();
    const messageDetails = mockMessageDetails;
    const date = new Date();
    date.setDate(date.getDate() - 2);
    messageDetails.data.attributes.sentDate = date.toISOString();
    landingPage.loadInboxMessages();
    sentPage.loadSentMessages(sentMessages, messageDetails);
    detailsPage.loadMessageDetails(messageDetails, defaultMockThread);
    cy.injectAxe();
    cy.axeCheck();
  });
});
