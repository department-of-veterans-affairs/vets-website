import manifest from '../../manifest.json';
import PatientMessagesLandingPage from './pages/PatientMessagesLandingPage';
import mockMessages from './fixtures/drafts-search-results.json';
import mockDraftsFolder from './fixtures/folder-drafts-metadata.json';
import mockSentFolder from './fixtures/folder-sent-metadata.json';
import PatientBasicSearchPage from './pages/PatientBasicSearchPage';

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
    const basicSearchPage = new PatientBasicSearchPage();
    landingPage.login();
    landingPage.loadPage();
    basicSearchPage.clickSearchMessage();

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
    basicSearchPage.getInputFieldText();
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Inbox', { force: true });
    // basicSearchPage.selectMessagesFolder(Inbox);
    basicSearchPage.submitSearch();
    cy.wait('@basicSearchInboxRequest');
    basicSearchPage.verifyHighlightedText();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Drafts Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    const basicSearchPage = new PatientBasicSearchPage();
    landingPage.login();
    landingPage.loadPage();
    basicSearchPage.clickSearchMessage();

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

    basicSearchPage.getInputFieldText();
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Drafts', { force: true });
    // basicSearchPage.selectMessagesFolder(Drafts);
    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestDrafts');
    basicSearchPage.verifyHighlightedText();
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Basic Search Sent Folder Check', () => {
    const landingPage = new PatientMessagesLandingPage();
    const basicSearchPage = new PatientBasicSearchPage();
    landingPage.login();
    landingPage.loadPage();
    basicSearchPage.clickSearchMessage();

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

    basicSearchPage.getInputFieldText();
    cy.get('[data-testid="folder-dropdown"]')
      .shadow()
      .find('select')
      .select('Sent', { force: true });
    // basicSearchPage.selectMessagesFolder('Sent');
    basicSearchPage.submitSearch();
    cy.wait('@basicSearchRequestSentFolder');
    basicSearchPage.verifyHighlightedText();
    cy.injectAxe();
    cy.axeCheck();
  });
});
