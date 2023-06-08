import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockSpeciaCharMessage from './fixtures/message-response-specialchars.json';
import defaultMockThread from './fixtures/thread-response.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging - Search Special Characters', () => {
  const basicSearchPage = new PatientBasicSearchPage();

  const landingPage = new PatientInboxPage();
  const messageDetailsPage = new PatientMessageDetailsPage();
  const site = new SecureMessagingSite();

  it.skip('search for special characters', () => {
    site.login();
    mockSpeciaCharMessage.data.attributes.messageId = '2585370';
    mockSpeciaCharMessage.data.attributes.body = 'special %$#';
    landingPage.loadInboxMessages(mockSpeciaCharMessage);
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
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
    ).as('mockSpecialCharmessage');
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.reload();

    basicSearchPage.typeSearchInputFieldText('message%$#*');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');

    messageDetailsPage.loadMessageDetails(
      mockSpeciaCharMessage,
      defaultMockThread,
    );
    cy.get('pre').should('contain', 'special %$#');

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
