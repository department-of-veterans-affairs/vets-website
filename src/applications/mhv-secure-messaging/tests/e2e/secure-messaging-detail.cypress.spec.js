import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import inboxMessages from './fixtures/messages-response.json';
import mockMessageDetails from './fixtures/message-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Message Details AXE Check', () => {
  it('Axe Check Message Details Page', () => {
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    // const messageDetails = mockMessageDetails;
    // const messageDetails = landingPage.setMessageDateToYesterday(mockMessageDetails);
    const date = new Date();
    date.setDate(date.getDate() - 2);
    mockMessageDetails.data.attributes.sentDate = date.toISOString();
    cy.log(`New Message Details ==== ${JSON.stringify(mockMessageDetails)}`);
    landingPage.loadInboxMessages(inboxMessages, mockMessageDetails);
    detailsPage.loadMessageDetails(mockMessageDetails, defaultMockThread, 0);
    detailsPage.verifyMessageDetails(mockMessageDetails);
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
