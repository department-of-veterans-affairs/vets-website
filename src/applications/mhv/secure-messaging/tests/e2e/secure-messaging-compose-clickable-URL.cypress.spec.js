import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import mockSpeciaCharMessage from './fixtures/message-response-specialchars.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging - Compose with Clickable URL', () => {
  // const basicSearchPage = new PatientBasicSearchPage();
  // const site = new SecureMessagingSite();

  it('search for clickable URL', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolder,
    ).as('basicSearchRequestSentMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestSentFolder');
    cy.get('[data-testid="sent-sidebar"]').click();
    PatientBasicSearchPage.typeSearchInputFieldText('message%$#*');
    PatientBasicSearchPage.submitSearch();

    cy.wait('@basicSearchRequestSentFolder');
    mockSpeciaCharMessage.data.attributes.messageId = '2585370';
    mockSpeciaCharMessage.data.attributes.body =
      'clickable URL  https://www.va.gov/';
    PatientInboxPage.loadMessageDetailsWithData(mockSpeciaCharMessage);
    cy.injectAxe();
    cy.axeCheck();
    // *Refactor* check only if it exists, do not visit
    cy.get('pre > a').click();
  });
});
