import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Reply to Expired Mesage', () => {
  it('reply expired messages', () => {
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages(
      mockMessages,
      landingPage.getExpired46DayOldMessageDetails(),
    );
    messageDetailsPage.loadMessageDetails(
      landingPage.getExpired46DayOldMessageDetails(),
      defaultMockThread,
      0,
    );
    /*
    cy.get('[data-testid=expired-alert-message]').should(
      'have.text',
      'This conversation is too old for new replies',
    );
    cy.get('[data-testid=expired-alert-message]+p').should(
      'have.text',
      "The last message in this conversation is more than 45 days old. If you want to continue this conversation, you'll need to start a new message.",
    );
*/
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
