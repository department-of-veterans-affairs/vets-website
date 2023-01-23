import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
// import mockURLMessage from './fixtures/message-clickableUrl-response.json';
import mockSpeciaCharMessage from './fixtures/message-response-specialchars.json';

describe('Secure Messaging - Compose with Clickable URL', () => {
  const basicSearchPage = new PatientBasicSearchPage();

  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  it('search for clickable URL', () => {
    site.login();
    landingPage.loadPage();
    cy.injectAxe();
    cy.axeCheck();
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
    // cy.intercept(
    //   'GET',
    //   '/my_health/v1/messaging/messages/2585368',
    //   mockURLMessage,
    // ).as('urlMessage');
    // cy.intercept(
    //   'GET',
    //   '/my_health/v1/messaging/messages/2585368/thread',
    //   mockURLMessage,
    // ).as('urlMessageThread');
    cy.get('[data-testid="sent-sidebar"]').click();

    basicSearchPage.typeSearchInputFieldText('message%$#*');

    basicSearchPage.submitSearch();

    cy.wait('@basicSearchRequestSentFolder');
    mockSpeciaCharMessage.data.attributes.messageId = '2585370';
    mockSpeciaCharMessage.data.attributes.body =
      'clickable URL  https://www.va.gov/';
    landingPage.loadMessageDetailsWithData(mockSpeciaCharMessage);
    // cy.contains('clickable url test').click();
    cy.get('pre > a').click();

    cy.injectAxe();
    cy.axeCheck();
  });
});
