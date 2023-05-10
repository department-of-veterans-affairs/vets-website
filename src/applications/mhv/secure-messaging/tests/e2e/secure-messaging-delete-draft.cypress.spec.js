import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockThreadResponse from './fixtures/single-draft-response.json';

describe('Secure Messaging Delete Draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftsPage = new PatientMessageDraftsPage();
  const patientInterstitialPage = new PatientInterstitialPage();
  it(' Delete Drafts', () => {
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    patientInterstitialPage.getContinueButton().click();
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck();
    draftsPage.confirmDeleteDraft(mockDraftResponse);
    inboxPage.verifyDeleteConfirmMessage();
    cy.injectAxe();
    cy.axeCheck();
  });
});

describe(' Draft page Message Sort', () => {
  beforeEach(() => {
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    inboxPage.loadInboxMessages();
    cy.reload(true);
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    patientInterstitialPage.getContinueButton().click();
    draftsPage.clickDeleteButton();
    draftsPage.confirmDeleteDraft(mockDraftResponse);
    inboxPage.verifyDeleteConfirmMessage();
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
