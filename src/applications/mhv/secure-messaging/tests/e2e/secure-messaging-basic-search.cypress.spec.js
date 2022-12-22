import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';

describe(manifest.appName, () => {
  it('Basic Search Axe Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchRequest');
    cy.get('[data-testid="basic-search-submit"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Inbox Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/*/messages*',
      mockMessages,
    ).as('basicSearchInboxRequest');

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchInboxRequest');
    cy.get('[data-testid="keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('test');

    cy.get('[data-testid="basic-search-submit"]').click();
    cy.wait('@basicSearchInboxRequest');
    cy.get('[data-testid="highlighted-text"]').should('contain', 'test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Drafts Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftsFolder,
    ).as('basicSearchRequestDraftsMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestDrafts');

    cy.get('[data-testid="keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('test');

    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Drafts', { force: true });

    cy.get('[data-testid="basic-search-submit"]').click({ force: true });
    cy.wait('@basicSearchRequestDrafts');
    cy.get('[data-testid="highlighted-text"]').should('contain', 'test');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Sent Folder Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    landingPage.login();
    landingPage.loadPage();
    cy.get('[data-testid="search-messages-sidebar"]').click();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1',
      mockSentFolder,
    ).as('basicSearchRequestDraftsMeta');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/messages?per_page=-1',
      mockMessages,
    ).as('basicSearchRequestSentFolder');

    cy.get('[data-testid="keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('test');

    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Sent', { force: true });

    cy.get('[data-testid="basic-search-submit"]').click({ force: true });
    // cy.wait('@basicSearchRequestSentFolder');
    // cy.get('[data-testid="highlighted-text"]').should('contain', 'test');
    cy.injectAxe();
    cy.axeCheck();
  });
});
