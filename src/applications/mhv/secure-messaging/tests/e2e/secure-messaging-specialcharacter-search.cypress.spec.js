import manifest from '../../manifest.json';

import SecureMessagingSite from './site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockSpeciaCharMessage from './fixtures/message-response-specialchars.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';

describe(manifest.appName, () => {
  const basicSearchPage = new PatientBasicSearchPage();

  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  it('search for special characters', () => {
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
    cy.get('[data-testid="sent-sidebar"]').click();

    basicSearchPage.typeSearchInputFieldText('message%$#*');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');

    cy.injectAxe();
    cy.axeCheck();
    mockSpeciaCharMessage.data.attributes.messageId = '2585370';
    mockSpeciaCharMessage.data.attributes.body = 'special %$#';
    landingPage.loadMessageDetailsWithData(mockSpeciaCharMessage);
    cy.get('pre').should('contain', 'special %$#');
  });
});
