import SecureMessagingSite from './sm_site/SecureMessagingSite';
// import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
// import mockSpeciaCharMessage from './fixtures/message-response-specialchars.json';
import mockClickableUrlMessage from './fixtures/message-clickableUrl-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
// import defaultMockThread from './fixtures/thread-response.json';

describe('Secure Messaging - Compose with Clickable URL', () => {
  // const basicSearchPage = new PatientBasicSearchPage();
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  const messageDetailsPage = new PatientMessageDetailsPage();
  const messageDetails = mockClickableUrlMessage;
  it('search for clickable URL', () => {
    site.login();
    landingPage.loadInboxMessages();
    // site.loadPage();
    cy.injectAxe();
    cy.axeCheck();
    const date = new Date();
    date.setDate(date.getDate() - 2);
    messageDetails.data.attributes.sentDate = date.toISOString();
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
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads?pageSize=100&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
      mockMessages,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/2585368/thread',
      mockClickableUrlMessage,
    ).as('clickableURLThread');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/2585368',
      mockClickableUrlMessage,
    ).as('message');

    cy.get('[data-testid="sent-sidebar"]').click();
    cy.get('[data-testid="keyword-search-input"]')
      .shadow()
      .find('#va-search-input', { force: true })
      .type('clickable url test');
    cy.get('[data-testid="keyword-search-input"]')
      .shadow()
      .find('#va-search-button')
      .click();
    cy.get('[data-testid="highlighted-text"]')
      .should('contain', 'clickable url test')
      .click();
    cy.wait('@clickableURLThread');
    cy.log(`New Message Details ==== ${JSON.stringify(messageDetails)}`);
    // cy.wait('@message');
    messageDetailsPage.loadMessageDetails(messageDetails, mockMessages, 0);

    // cy.wait('@clickableURLThread');
    // cy.wait('@message');

    // basicSearchPage.typeSearchInputFieldText('message%$#*');
    // basicSearchPage.submitSearch();

    // cy.wait('@basicSearchRequestSentFolder');
    // mockSpeciaCharMessage.data.attributes.messageId = '2585370';
    // mockSpeciaCharMessage.data.attributes.body =
    //   'clickable URL  https://www.va.gov/';
    // site.loadMessageDetailsWithData(mockSpeciaCharMessage);
    // cy.injectAxe();
    // cy.axeCheck();
    // // *Refactor* check only if it exists, do not visit
    // cy.get('pre > a').should('exist');
  });
});
