import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Reply to Expired Mesage', () => {
  it('reply expired messages', () => {
    const messageDetailsPage = new PatientMessageDetailsPage();
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages(
      mockMessages,
      PatientInboxPage.getExpired46DayOldMessageDetails(),
    );
    messageDetailsPage.loadMessageDetails(
      PatientInboxPage.getExpired46DayOldMessageDetails(),
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
