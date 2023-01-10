import manifest from '../../manifest.json';

import SecureMessagingSite from './site/SecureMessagingSite';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from './fixtures/drafts-search-results.json';

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
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/2585370/thread',
      mockMessages,
    ).as('specialCharSearch');

    cy.get('[data-testid="sent-sidebar"]').click();

    basicSearchPage.typeSearchInputFieldText('special message%$#*');

    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');
    // basicSearchPage.verifyHighlightedText('special');
    cy.injectAxe();
    cy.axeCheck();
    // cy.get('[data-testid="highlighted-text"]').click({ force: true });

    // cy.wait('@specialCharSearch');
    // cy.on('uncaught:exception', (err, runnable) => {
    //     // returning false here prevents Cypress from
    //     // failing the test
    //     return false;

    // });

    cy.get('.message-subject-link > :nth-child(1) > span').click({
      waitforanimations: true,
    });
    // cy.get('[class="message-subject-link vads-u-margin-y--0p5"]').click({ force: true });
    // cy.get('.message-subject-link').click({ force: true });
  });
});
