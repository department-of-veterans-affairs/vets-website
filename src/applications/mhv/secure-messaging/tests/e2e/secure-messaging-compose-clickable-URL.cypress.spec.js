import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import mockSpeciaCharMessage from './fixtures/message-response-specialchars.json';

describe('Secure Messaging - Compose with Clickable URL', () => {
  const basicSearchPage = new PatientBasicSearchPage();
  const site = new SecureMessagingSite();

  it.skip('search for clickable URL', () => {
    site.login();
    site.loadPage();
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
    basicSearchPage.typeSearchInputFieldText('message%$#*');
    basicSearchPage.submitSearch();

    cy.wait('@basicSearchRequestSentFolder');
    mockSpeciaCharMessage.data.attributes.messageId = '2585370';
    mockSpeciaCharMessage.data.attributes.body =
      'clickable URL  https://www.va.gov/';
    site.loadMessageDetailsWithData(mockSpeciaCharMessage);
    cy.injectAxe();
    cy.axeCheck();
    // *Refactor* check only if it exists, do not visit
    cy.get('pre > a').click();
  });
});
