import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';

describe(' Draft page Message Sort', () => {
  beforeEach(() => {
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    site.login();
    inboxPage.loadInboxMessages();
    cy.reload(true);
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    cy.get('.sidebar-navigation-messages-list-header > a');
  });
  it('Sort Inbox Messages from Newest to Oldest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Newest to oldest');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Oldest to Newest', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('ASC', { force: true })
      .should('contain', 'newest');
    cy.injectAxe();
    cy.axeCheck();
  });
  it('Sort Inbox Messages from A to Z', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .select('ASC', { force: true })
      .should('contain', 'A to Z');
    cy.injectAxe();
    cy.axeCheck();
  });

  it('Sort Inbox Messages from Z to A', () => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('select')
      .should('contain', 'Z to A');
    cy.injectAxe();
    cy.axeCheck();
  });

  afterEach(() => {
    cy.get('[data-testid="sort-button"]').click({ force: true });
  });
});
