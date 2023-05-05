import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessagesPageOne from './fixtures/messages-response.json';
import mockMessagesPageTwo from './fixtures/messages-response-page-2.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();

    landingPage.loadInboxMessages(mockMessagesPageOne);
    site.loadVAPaginationNextMessages(2, mockMessagesPageTwo);
    cy.get('[data-testid="displaying-number-of-threads"]').should(
      'have.text',
      'Displaying 11 - 20 of 28 Conversations',
    );
    site.loadVAPaginationPreviousMessages(1, mockMessagesPageOne);
    site.loadVAPaginationPageMessages(1, mockMessagesPageOne);
    site.loadVAPaginationPageMessages(2, mockMessagesPageTwo);

    cy.injectAxe();
    cy.axeCheck();
  });
});
